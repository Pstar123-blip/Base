import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  DEFAULT_NUMBER_OF_SESSIONS,
  MAX_NUMBER_OF_SESSIONS,
  MAX_SEARCH_LENGTH,
  SESSION_STATUSES,
  SESSION_TYPES,
} from './sessions.constants.js';

export class SessionDto {
  @ApiProperty() session_id!: string;

  @ApiProperty({ enum: SESSION_TYPES, enumName: 'SessionType' })
  type!: (typeof SESSION_TYPES)[number];

  @ApiProperty() session_owner!: string;

  @ApiProperty() image_a_url!: string;

  @ApiProperty() image_b_url!: string;

  @ApiProperty({ format: 'date-time' }) creation_time!: string;

  @ApiProperty({ format: 'date-time' }) last_update!: string;

  @ApiProperty({ type: Number, nullable: true, minimum: 0, maximum: 100 })
  progress!: number | null;

  @ApiProperty({ enum: SESSION_STATUSES, enumName: 'SessionStatus' })
  status!: (typeof SESSION_STATUSES)[number];

  @ApiProperty() notes!: string;

  @ApiProperty({ type: String, nullable: true }) logs!: string | null;
}

export class SessionSearchValuesDto {
  @ApiPropertyOptional({
    description: 'Case-insensitive text to look for in the session id',
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  session_id?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive text to look for in the session owner',
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  session_owner?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive text to look for in the session status',
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  status?: string;
}

export class SessionTypeParamDto {
  @ApiProperty({ enum: SESSION_TYPES, enumName: 'SessionType' })
  @IsIn(SESSION_TYPES)
  type!: (typeof SESSION_TYPES)[number];
}

export class DeleteSessionParamDto {
  @ApiProperty({ enum: SESSION_TYPES, enumName: 'SessionType' })
  @IsIn(SESSION_TYPES)
  type!: (typeof SESSION_TYPES)[number];

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  sessionId!: string;
}

export class DeleteSessionQueryDto {
  @ApiProperty({ description: 'The session is deleted only when true' })
  @Transform(({ value }: { value: unknown }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  should_delete!: boolean;
}

export class GroupSessionsQueryDto {
  @ApiPropertyOptional({ minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  first_session_index: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: MAX_NUMBER_OF_SESSIONS,
    default: DEFAULT_NUMBER_OF_SESSIONS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_NUMBER_OF_SESSIONS)
  number_of_sessions: number = DEFAULT_NUMBER_OF_SESSIONS;
}

export class GroupSessionsBodyDto {
  @ApiPropertyOptional({
    type: SessionSearchValuesDto,
    description: 'Sessions must match every provided value',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SessionSearchValuesDto)
  search_values?: SessionSearchValuesDto;
}
