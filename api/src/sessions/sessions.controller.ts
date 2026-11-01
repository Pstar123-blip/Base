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

import { ListSessionsQueryDto, SessionsPageDto } from './sessions.dto.js';
import { SessionsRepository } from './sessions.repository.js';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessions: SessionsRepository) {}

  @Get()
  @ApiOperation({ summary: 'List sessions (paginated, filterable)' })
  @ApiOkResponse({ type: SessionsPageDto })
  async listSessions(@Query() query: ListSessionsQueryDto) {
    const { items, total } = await this.sessions.list(query);
    return {
      total,
      items: items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    } as SessionsPageDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a session' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  async deleteSession(@Param('id', ParseUUIDPipe) id: string) {
    if (!(await this.sessions.delete(id))) {
      throw new NotFoundException();
    }
  }
}
