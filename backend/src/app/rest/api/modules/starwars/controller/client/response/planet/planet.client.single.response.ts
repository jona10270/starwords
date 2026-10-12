import { ApiProperty } from '@nestjs/swagger';
import { PlanetVM } from '../../../../model/planet/planet.view-model';
import { PlanetWithIdDto } from '@app/modules/starwars/planet/dto/planet.all.dto';

export class PlanetSingleResponse {
  @ApiProperty({
    type: PlanetVM,
  })
  public readonly planet: PlanetVM;

  public constructor(planet: PlanetWithIdDto) {
    this.planet = new PlanetVM(planet);
  }
}
