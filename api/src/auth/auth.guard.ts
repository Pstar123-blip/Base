import {
  type CanActivate,
  createParamDecorator,
  type ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { ENV_KEYS } from '../envKeys.constants.js';
import { MAX_USERNAME_LENGTH } from './auth.constants.js';
import type { UserDto } from './auth.dto.js';

const PUBLIC_METADATA_KEY = 'public';

export type AuthClaims = Record<string, unknown> & { username: string };
export type AuthenticatedRequest = Request & {
  user?: UserDto;
  auth?: AuthClaims;
};

export const Public = () => SetMetadata(PUBLIC_METADATA_KEY, true);
export const User = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<Request & { user: UserDto }>().user,
);
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext) {
    if (
      this.reflector.getAllAndOverride<boolean>(PUBLIC_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.[1];

    if (!token) {
      this.logger.debug('Authentication rejected: missing bearer token');
      throw new UnauthorizedException();
    }

    const devMasterToken = this.config.get<string>(ENV_KEYS.DEV_MASTER_TOKEN);

    if (
      this.config.get<string>(ENV_KEYS.NODE_ENV) === 'development' &&
      devMasterToken &&
      token === devMasterToken
    ) {
      this.logger.debug('Development master token accepted');
      return true;
    }

    let claims: Record<string, unknown>;

    try {
      claims = this.jwt.verify(token);
    } catch {
      this.logger.debug('Authentication rejected: invalid access token');
      throw new UnauthorizedException();
    }

    if (
      typeof claims.username !== 'string' ||
      !claims.username.trim() ||
      claims.username.length > MAX_USERNAME_LENGTH
    ) {
      throw new UnauthorizedException();
    }

    request.user = {
      id: claims.username,
      username: claims.username,
    };
    request.auth = claims as AuthClaims;
    return true;
  }
}
