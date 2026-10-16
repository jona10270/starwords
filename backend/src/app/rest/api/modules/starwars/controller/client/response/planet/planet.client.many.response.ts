import { ApiProperty } from '@nestjs/swagger';
import { PlanetVM } from '../../../../model/planet/planet.view-model';
import { PlanetDetailDto } from '@app/modules/starwars/planet/dto/planet.all.dto';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';

export class PlanetManyResponse {
  @ApiProperty({
    type: [PlanetVM],
  })
  public readonly planets: PlanetVM[];

  @ApiProperty({
    type: PaginationMetaVM,
  })
  public readonly meta: PaginationMetaVM;

  public constructor(
    data: PlanetDetailDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.planets = data.map((planet) => new PlanetVM(planet));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
