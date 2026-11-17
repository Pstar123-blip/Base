import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { TrainingService } from './training.service.js';

@ApiTags('training')
@ApiBearerAuth()
@Controller('training')
export class TrainingController {
  constructor(private readonly training: TrainingService) {}

  @Get('types')
  @ApiOperation({ summary: 'List the types a training can be run with' })
  @ApiOkResponse({ type: String, isArray: true })
  listTypes() {
    return this.training.listTypes();
  }
}
