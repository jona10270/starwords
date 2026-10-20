import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ResourceRefDto,
  ResourceTitleDto,
} from '@app/modules/starwars/common/resource-ref.dto';
import { ResourceResidentDto } from '@app/modules/starwars/common/resource-ref.dto';
import { ResourceNameDto } from '@app/modules/starwars/common/resource-ref.dto';

export class ResourceRefVM {
  @ApiPropertyOptional({ type: String, example: '1' })
  public readonly id: string;

  @ApiPropertyOptional({ type: String, example: 'A New Hope' })
  public readonly title: string;

  constructor(resourceRef: ResourceRefDto) {
    this.id = resourceRef.id;
    this.title = resourceRef.title;
  }
}

export class ResourceResidentVM {
  @ApiPropertyOptional({ type: String, example: '1' })
  public readonly id: string;

  @ApiPropertyOptional({ type: String, example: 'Luke Skywalker' })
  public readonly name: string;

  constructor(resourceRes: ResourceResidentDto) {
    this.id = resourceRes.id;
    this.name = resourceRes.name;
  }
}

export class ResourceNameVM {
  @ApiPropertyOptional({ type: String, example: '1' })
  public readonly id: string;

  @ApiPropertyOptional({ type: String, example: 'Tatooine' })
  public readonly name: string;

  constructor(resourceName: ResourceNameDto) {
    this.id = resourceName.id;
    this.name = resourceName.name;
  }
}

export class ResourceTitleVM {
  @ApiPropertyOptional({ type: String, example: '1' })
  public readonly id: string;

  @ApiPropertyOptional({ type: String, example: 'A New Hope' })
  public readonly title: string;

  constructor(resourceTitle: ResourceTitleDto) {
    this.id = resourceTitle.id;
    this.title = resourceTitle.title;
  }
}
