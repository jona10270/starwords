import { ApiProperty } from '@nestjs/swagger';
import { StarshipVM } from '../../../../model/starship/starship.view-model';
import { StarshipDetailDto } from '@app/modules/starwars/starships/dto/starship.all.dto';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';

export class StarshipManyResponse {
  @ApiProperty({
    type: [StarshipVM],
  })
  public readonly starship: StarshipVM[];

  @ApiProperty({
    type: PaginationMetaVM,
  })
  public readonly meta: PaginationMetaVM;

  public constructor(
    data: StarshipDetailDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.starship = data.map((starship) => new StarshipVM(starship));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
