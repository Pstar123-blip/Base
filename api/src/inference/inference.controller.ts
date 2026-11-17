import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { InferenceService } from './inference.service.js';

@ApiTags('inference')
@ApiBearerAuth()
@Controller('inference')
export class InferenceController {
  constructor(private readonly inference: InferenceService) {}

  @Get('statistics')
  @ApiOperation({ summary: 'List the statistics an inference can compute' })
  @ApiOkResponse({ type: String, isArray: true })
  listStatistics() {
    return this.inference.listStatistics();
  }
}
