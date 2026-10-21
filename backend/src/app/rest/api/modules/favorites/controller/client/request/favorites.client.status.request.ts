import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ResourceTypeEnum } from '@app/modules/favorites/enum/resource-type.enum';

export class FavoriteStatusRequestDto {
  @ApiProperty({
    type: String,
    example: '1,2,3,4,5,6',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @ArrayMaxSize(50)
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public readonly resourceIds!: string[];

  @ApiProperty({
    type: String,
    example: 'PEOPLE',
  })
  @IsNotEmpty()
  @IsEnum(ResourceTypeEnum)
  public readonly resourceType!: ResourceTypeEnum;
}
