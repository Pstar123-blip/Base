import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MAX_SEARCH_LENGTH,
  SESSION_SEARCH_FIELDS,
  SESSION_SORT_FIELDS,
  SESSION_STATUSES,
  SESSION_TYPES,
  SORT_DIRECTIONS,
} from './sessions.constants.js';

export class SessionDto {
  @ApiProperty() id!: string;

  @ApiProperty({ enum: SESSION_TYPES, enumName: 'SessionType' })
  type!: (typeof SESSION_TYPES)[number];

  @ApiProperty() owner!: string;

  @ApiProperty() imageAUrl!: string;

  @ApiProperty() imageBUrl!: string;

  @ApiProperty({ format: 'date-time' }) createdAt!: string;

  @ApiProperty({ format: 'date-time' }) updatedAt!: string;

  @ApiProperty({ minimum: 0, maximum: 100 }) progress!: number;

  @ApiProperty({ enum: SESSION_STATUSES, enumName: 'SessionStatus' })
  status!: (typeof SESSION_STATUSES)[number];
}

export class SessionsPageDto {
  @ApiProperty({ type: [SessionDto] }) items!: SessionDto[];

  @ApiProperty({ description: 'Total sessions matching the filters' })
  total!: number;
}

export class ListSessionsQueryDto {
  @ApiPropertyOptional({ minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: MAX_PAGE_SIZE,
    default: DEFAULT_PAGE_SIZE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize: number = DEFAULT_PAGE_SIZE;

  @ApiPropertyOptional({
    description: 'Case-insensitive text to look for in `searchField`',
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  search?: string;

  @ApiPropertyOptional({
    enum: SESSION_SEARCH_FIELDS,
    enumName: 'SessionSearchField',
    default: 'id',
  })
  @IsOptional()
  @IsIn(SESSION_SEARCH_FIELDS)
  searchField: (typeof SESSION_SEARCH_FIELDS)[number] = 'id';

  @ApiPropertyOptional({ enum: SESSION_TYPES, enumName: 'SessionType' })
  @IsOptional()
  @IsIn(SESSION_TYPES)
  type?: (typeof SESSION_TYPES)[number];

  @ApiPropertyOptional({
    enum: SESSION_SORT_FIELDS,
    enumName: 'SessionSortField',
    default: 'updatedAt',
  })
  @IsOptional()
  @IsIn(SESSION_SORT_FIELDS)
  sortBy: (typeof SESSION_SORT_FIELDS)[number] = 'updatedAt';

  @ApiPropertyOptional({
    enum: SORT_DIRECTIONS,
    enumName: 'SortDirection',
    default: 'desc',
  })
  @IsOptional()
  @IsIn(SORT_DIRECTIONS)
  sortDirection: (typeof SORT_DIRECTIONS)[number] = 'desc';
}
