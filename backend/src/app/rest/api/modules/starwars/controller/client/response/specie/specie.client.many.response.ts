import { ApiProperty } from '@nestjs/swagger';
import { SpecieVM } from '../../../../model/specie/specie.view-model';
import { SpecieWithIdDto } from '@app/modules/starwars/specie/dto/specie.all.dto';

export class SpecieManyResponse {
  @ApiProperty({
    type: [SpecieVM],
  })
  public readonly species: SpecieVM[];

  public constructor(data: SpecieWithIdDto[]) {
    this.species = data.map((specie) => new SpecieVM(specie));
  }
}
