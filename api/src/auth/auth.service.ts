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
} from './auth.constants.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly adfs: AdfsService,
  ) {}

  async login(adfsToken: string) {
    if (!adfsToken?.trim()) {
      throw new UnauthorizedException('ADFS token is required');
    }

    const { username } = await this.adfs.getUser(adfsToken);

    const user = { id: username, username };

    return {
      ...this.issue(user.id, user.username),
      user,
    };
  }

  private issue(userId: string, username: string) {
    const accessToken = this.jwt.sign(
      { sub: userId, username, kind: ACCESS_TOKEN_KIND },
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
