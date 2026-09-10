import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Request, Response } from 'express';

import { ENV_KEYS } from '../envKeys.constants.js';
import { REFRESH_COOKIE_NAME, REFRESH_TOKEN_TTL_MS } from './auth.constants.js';
import { CredentialsDto, TokenDto, UserDto } from './auth.dto.js';
import { Public, User } from './auth.guard.js';
import { AuthService } from './auth.service.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get(ENV_KEYS.NODE_ENV) === 'production',
      sameSite: 'strict',
      path: '/api/auth',
    };
  }

  private validateOrigin(req: Request) {
    if (
      req.headers.origin !==
      this.config.getOrThrow<string>(ENV_KEYS.CLIENT_ORIGIN)
    ) {
      throw new ForbiddenException('Untrusted origin');
    }
  }

  private respond(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
      ...this.getCookieOptions(),
      maxAge: REFRESH_TOKEN_TTL_MS,
    });
    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenDto })
  async register(
    @Body() dto: CredentialsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.validateOrigin(req);
    return this.respond(res, await this.auth.register(dto.email, dto.password));
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenDto })
  async login(
    @Body() dto: CredentialsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.validateOrigin(req);
    return this.respond(res, await this.auth.login(dto.email, dto.password));
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenDto })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.validateOrigin(req);
    return this.respond(
      res,
      await this.auth.refresh(String(req.cookies?.[REFRESH_COOKIE_NAME] ?? '')),
    );
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.validateOrigin(req);
    await this.auth.logout(String(req.cookies?.[REFRESH_COOKIE_NAME] ?? ''));
    res.clearCookie(REFRESH_COOKIE_NAME, this.getCookieOptions());
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  me(@User() user: UserDto) {
    return user;
  }
}
