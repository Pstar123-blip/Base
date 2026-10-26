import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { AuthClaims } from './auth.guard.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwt: JwtService) {}

  createToken(identity: AuthClaims) {
    // Only the identity is carried over; other provider claims are not promoted.
    const accessToken = this.jwt.sign({ username: identity.username });
    this.logger.log('Login completed');
    return {
      accessToken,
      user: { id: identity.username, username: identity.username },
    };
  }
}
