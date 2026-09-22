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
} from './auth.constants.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
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
    const accessToken = await this.jwt.signAsync(
      { sub: userId, kind: ACCESS_TOKEN_KIND },
      {
        secret: this.config.getOrThrow<string>(ENV_KEYS.JWT_ACCESS_SECRET),
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );
    return { accessToken };
  }
}
