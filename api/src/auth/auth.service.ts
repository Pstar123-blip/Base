import { createHash, randomUUID } from 'node:crypto';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { and, eq, gt } from 'drizzle-orm';

import { Database } from '../database/database.module.js';
import { sessions } from '../database/schema.js';
import {
  ACCESS_TOKEN_KIND,
  ACCESS_TOKEN_TTL_SECONDS,
  JWT_AUDIENCE,
  JWT_ISSUER,
  REFRESH_TOKEN_KIND,
  REFRESH_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_SECONDS,
} from './auth.constants.js';
import { hashPassword, verifyPassword } from './password.js';
import { UsersRepository } from './users.repository.js';
const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex');
@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly database: Database,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async register(email: string, password: string) {
    const user = await this.users.create(
      email.toLowerCase().trim(),
      await hashPassword(password),
    );
    if (!user) throw new ConflictException('Account already exists');
    return this.issue(user.id);
  }
  async login(email: string, password: string) {
    const user = await this.users.byEmail(email.toLowerCase().trim());
    if (!user || !(await verifyPassword(password, user.passwordHash)))
      throw new UnauthorizedException('Invalid credentials');
    return this.issue(user.id);
  }
  private async issue(userId: string) {
    const id = randomUUID();
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, sid: id, kind: REFRESH_TOKEN_KIND },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: REFRESH_TOKEN_TTL_SECONDS,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );
    await this.database.db.insert(sessions).values({
      id,
      userId,
      tokenHash: digest(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });
    const accessToken = await this.jwt.signAsync(
      { sub: userId, kind: ACCESS_TOKEN_KIND },
      {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
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
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
    } catch {
      throw new UnauthorizedException();
    }
    if (
      claims.kind !== REFRESH_TOKEN_KIND ||
      !(await this.users.byId(claims.sub))
    )
      throw new UnauthorizedException();
    const consumed = await this.database.db
      .delete(sessions)
      .where(
        and(
          eq(sessions.id, claims.sid),
          eq(sessions.tokenHash, digest(token)),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .returning();
    if (!consumed.length) throw new UnauthorizedException();
    return this.issue(claims.sub);
  }
  async logout(token: string) {
    await this.database.db
      .delete(sessions)
      .where(eq(sessions.tokenHash, digest(token)));
  }
}
