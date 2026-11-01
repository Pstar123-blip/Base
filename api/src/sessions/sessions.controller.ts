import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  GroupSessionsQueryDto,
  SessionsPageDto,
  SessionTypeParamDto,
} from './sessions.dto.js';
import { SessionsService } from './sessions.service.js';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller()
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get('sessions/group')
  @ApiOperation({ summary: 'Get a group of sessions of any type' })
  @ApiOkResponse({ type: SessionsPageDto })
  groupSessions(@Query() query: GroupSessionsQueryDto) {
    return this.sessions.group(query);
  }

  @Get(':type/sessions/group')
  @ApiOperation({ summary: 'Get a group of sessions of a single type' })
  @ApiOkResponse({ type: SessionsPageDto })
  groupSessionsByType(
    @Param() { type }: SessionTypeParamDto,
    @Query() query: GroupSessionsQueryDto,
  ) {
    return this.sessions.group(query, type);
  }

  @Delete('sessions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a session' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  async deleteSession(@Param('id', ParseUUIDPipe) id: string) {
    await this.sessions.delete(id);
  }
}
