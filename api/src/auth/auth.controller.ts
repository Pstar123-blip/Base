import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { ENV_KEYS } from '../envKeys.constants.js';
import { AdfsLoginDto, LoginResponseDto, UserDto } from './auth.dto.js';
import { Public, User } from './auth.guard.js';
import { AuthService } from './auth.service.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private validateOrigin(req: Request) {
    if (
      req.headers.origin !==
      this.config.getOrThrow<string>(ENV_KEYS.CLIENT_ORIGIN)
    ) {
      throw new ForbiddenException('Untrusted origin');
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() dto: AdfsLoginDto, @Req() req: Request) {
    this.validateOrigin(req);
    return this.auth.login(dto.adfsToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  me(@User() user: UserDto) {
    return user;
  }
}
