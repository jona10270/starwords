import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationFavoriteQueryDto {
  // Page number for pagination
  @ApiPropertyOptional({
    type: Number,
    description: 'Page number',
    default: 1,
    minimum: 1,
    maximum: 10000,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Page must be at least 1' })
  // Pongo techo para que el offset no se salga del rango de postgres
  @Max(10000, { message: 'Page cannot exceed 10000' })
  public page: number = 1;

  // Limit of items per page
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(50, { message: 'Limit cannot exceed 50' })
  public limit: number = 10;
}
