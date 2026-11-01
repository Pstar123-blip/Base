import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
  SessionDto,
  SessionsPageDto,
  SessionTypeParamDto,
} from './sessions.dto.js';
import { SessionsRepository } from './sessions.repository.js';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller()
export class SessionsController {
  constructor(private readonly sessions: SessionsRepository) {}

  @Get('sessions/group')
  @ApiOperation({ summary: 'Get a group of sessions of any type' })
  @ApiOkResponse({ type: SessionsPageDto })
  groupSessions(@Query() query: GroupSessionsQueryDto) {
    return this.findGroup(query);
  }

  @Get(':type/sessions/group')
  @ApiOperation({ summary: 'Get a group of sessions of a single type' })
  @ApiOkResponse({ type: SessionsPageDto })
  groupSessionsByType(
    @Param() { type }: SessionTypeParamDto,
    @Query() query: GroupSessionsQueryDto,
  ) {
    return this.findGroup(query, type);
  }

  @Delete('sessions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a session' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  async deleteSession(@Param('id', ParseUUIDPipe) id: string) {
    if (!(await this.sessions.delete(id))) {
      throw new NotFoundException();
    }
  }

  private async findGroup(
    query: GroupSessionsQueryDto,
    type?: SessionTypeParamDto['type'],
  ) {
    const { items, total } = await this.sessions.group(query, type);
    return {
      total,
      items: items.map((item): SessionDto => ({
        session_id: item.id,
        type: item.type as SessionDto['type'],
        session_owner: item.owner,
        image_a_url: item.imageAUrl,
        image_b_url: item.imageBUrl,
        creation_time: item.createdAt.toISOString(),
        last_update: item.updatedAt.toISOString(),
        progress: item.progress,
        status: item.status as SessionDto['status'],
        notes: item.notes,
        logs: item.logs,
      })),
    };
  }
}
