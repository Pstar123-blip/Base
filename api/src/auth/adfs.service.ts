import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdfsService {
  // Mock lookup: replace with a verified ADFS token-to-user request.
  async getUser(adfsToken: string): Promise<{ username: string }> {
    if (!adfsToken?.trim()) {
      throw new UnauthorizedException('ADFS token is required');
    }

    return { username: 'mock.adfs' };
  }
}
