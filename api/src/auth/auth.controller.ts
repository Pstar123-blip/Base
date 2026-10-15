import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ENV_KEYS } from '../envKeys.constants.js';
import { LoginResponseDto, UserDto } from './auth.dto.js';
import { type AuthenticatedRequest, User } from './auth.guard.js';
import { AuthService } from './auth.service.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('create-token')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponseDto })
  createToken(@Req() req: AuthenticatedRequest) {
    if (
      req.headers.origin !==
      this.config.getOrThrow<string>(ENV_KEYS.CLIENT_ORIGIN)
    ) {
      throw new ForbiddenException('Untrusted origin');
    }

    if (!req.auth) throw new UnauthorizedException();
    return this.auth.createToken(req.auth);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  me(@User() user: UserDto) {
    return user;
  }
}
