import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from './pagination.query.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchPaginationQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Text to search by name or title',
    example: 'tato',
    maxLength: 50,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Search cannot exceed 50 characters' })
  public search?: string;
}
