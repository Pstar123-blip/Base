import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { AuthClaims } from './auth.guard.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwt: JwtService) {}

  createToken(identity: AuthClaims) {
    const payload = { ...identity };

    // The application sets its own lifetime instead of retaining ADFS JWT metadata.
    for (const claim of ['iat', 'exp', 'nbf', 'iss', 'aud']) {
      delete payload[claim];
    }

    const accessToken = this.jwt.sign(payload);
    this.logger.log('Login completed');
    return {
      accessToken,
      user: { id: identity.username, username: identity.username },
    };
  }
}
