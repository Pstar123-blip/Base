import {
  type CanActivate,
  createParamDecorator,
  type ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { ENV_KEYS } from '../envKeys.constants.js';
import {
  ACCESS_TOKEN_KIND,
  JWT_AUDIENCE,
  JWT_ISSUER,
} from './auth.constants.js';
import type { UserDto } from './auth.dto.js';
import { UsersRepository } from './users.repository.js';

const PUBLIC_METADATA_KEY = 'public';

export const Public = () => SetMetadata(PUBLIC_METADATA_KEY, true);
export const User = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<Request & { user: UserDto }>().user,
);
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly users: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (
      this.reflector.getAllAndOverride<boolean>(PUBLIC_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UserDto }>();
    const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    let claims: { sub: string; kind: string };

    try {
      claims = await this.jwt.verifyAsync(token, {
        secret: this.config.getOrThrow<string>(ENV_KEYS.JWT_ACCESS_SECRET),
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
    } catch {
      throw new UnauthorizedException();
    }

    if (claims.kind !== ACCESS_TOKEN_KIND) {
      throw new UnauthorizedException();
    }

    const user = await this.users.byId(claims.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = {
      id: user.id,
      username: user.username,
    };
    return true;
  }
}
