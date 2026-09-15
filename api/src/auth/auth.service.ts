import { createHash, randomUUID } from 'node:crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ENV_KEYS } from '../envKeys.constants.js';
import { AdfsService } from './adfs.service.js';
import {
  ACCESS_TOKEN_KIND,
  ACCESS_TOKEN_TTL_SECONDS,
  JWT_AUDIENCE,
  JWT_ISSUER,
  MAX_USERNAME_LENGTH,
  REFRESH_TOKEN_KIND,
  REFRESH_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_SECONDS,
} from './auth.constants.js';
import { SessionsRepository } from './sessions.repository.js';
import { UsersRepository } from './users.repository.js';

const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex');
@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly sessions: SessionsRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly adfs: AdfsService,
  ) {}

  async login(adfsToken: string) {
    if (!adfsToken?.trim()) {
      throw new UnauthorizedException('ADFS token is required');
    }

    const { username } = await this.adfs.getUser(adfsToken);

    if (
      typeof username !== 'string' ||
      !username.trim() ||
      username.length > MAX_USERNAME_LENGTH
    ) {
      throw new UnauthorizedException('ADFS user must have a unique username');
    }

    const user =
      (await this.users.byUsername(username)) ??
      (await this.users.create(username)) ??
      (await this.users.byUsername(username));

    if (!user) {
      throw new UnauthorizedException('Account is unavailable');
    }

    return {
      ...(await this.issue(user.id)),
      user: { id: user.id, username: user.username },
    };
  }

  private async issue(userId: string) {
    const id = randomUUID();
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, sid: id, kind: REFRESH_TOKEN_KIND },
      {
        secret: this.config.getOrThrow<string>(ENV_KEYS.JWT_REFRESH_SECRET),
        expiresIn: REFRESH_TOKEN_TTL_SECONDS,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );
    await this.sessions.create({
      id,
      userId,
      tokenHash: digest(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });
    const accessToken = await this.jwt.signAsync(
      { sub: userId, kind: ACCESS_TOKEN_KIND },
      {
        secret: this.config.getOrThrow<string>(ENV_KEYS.JWT_ACCESS_SECRET),
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );
    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    let claims: { sub: string; sid: string; kind: string };

    try {
      claims = await this.jwt.verifyAsync(token, {
        secret: this.config.getOrThrow<string>(ENV_KEYS.JWT_REFRESH_SECRET),
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
    } catch {
      throw new UnauthorizedException();
    }

    if (
      claims.kind !== REFRESH_TOKEN_KIND ||
      !(await this.users.byId(claims.sub))
    ) {
      throw new UnauthorizedException();
    }

    const consumed = await this.sessions.consume(claims.sid, digest(token));

    if (!consumed) {
      throw new UnauthorizedException();
    }

    return this.issue(claims.sub);
  }

  async logout(token: string) {
    await this.sessions.deleteByTokenHash(digest(token));
  }
}
