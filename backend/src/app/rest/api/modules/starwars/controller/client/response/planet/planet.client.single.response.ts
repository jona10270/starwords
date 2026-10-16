import { ApiProperty } from '@nestjs/swagger';
import { PlanetVM } from '../../../../model/planet/planet.view-model';
import { PlanetDetailDto } from '@app/modules/starwars/planet/dto/planet.all.dto';

export class PlanetSingleResponse {
  @ApiProperty({
    type: PlanetVM,
  })
  public readonly planet: PlanetVM;

  public constructor(planet: PlanetDetailDto) {
    this.planet = new PlanetVM(planet);
  }
}
