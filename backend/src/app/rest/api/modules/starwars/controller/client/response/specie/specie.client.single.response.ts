import { ApiProperty } from '@nestjs/swagger';
import { SpecieVM } from '../../../../model/specie/specie.view-model';
import { SpecieDetailDto } from '@app/modules/starwars/specie/dto/specie.all.dto';
export class SpecieSingleResponse {
  @ApiProperty({
    type: SpecieVM,
  })
  public readonly specie: SpecieVM;

  public constructor(data: SpecieDetailDto) {
    this.specie = new SpecieVM(data);
  }
}
