import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

import { AppService } from './app.service.js';
import { Public } from './auth/auth.guard.js';
class HealthDto {
  @ApiProperty() status!: string;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get('health')
  @ApiOkResponse({ type: HealthDto })
  health() {
    return { status: this.appService.getStatus() };
  }
}
