import { ApiProperty } from '@nestjs/swagger';
import { PlanetVM } from '../../../../model/planet/planet.view-model';
import { PlanetWithIdDto } from '@app/modules/starwars/planet/dto/planet.all.dto';

export class PlanetManyResponse {
  @ApiProperty({
    type: [PlanetVM],
  })
  public readonly planets: PlanetVM[];

  public constructor(data: PlanetWithIdDto[]) {
    this.planets = data.map((planet) => new PlanetVM(planet));
  }
}
