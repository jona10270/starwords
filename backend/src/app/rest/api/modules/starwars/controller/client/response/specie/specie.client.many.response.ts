import { ApiProperty } from '@nestjs/swagger';
import { SpecieVM } from '../../../../model/specie/specie.view-model';
import { SpecieWithIdDto } from '@app/modules/starwars/specie/dto/specie.all.dto';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';

export class SpecieManyResponse {
  @ApiProperty({
    type: [SpecieVM],
  })
  public readonly species: SpecieVM[];

  @ApiProperty({
    type: PaginationMetaVM,
  })
  public readonly meta: PaginationMetaVM;

  public constructor(
    data: SpecieWithIdDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.species = data.map((specie) => new SpecieVM(specie));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
