import { ApiProperty } from '@nestjs/swagger';

import { FilmWithIdDto } from '@app/modules/starwars/film/dto/film.all.dto';
import { FilmVM } from '../../../../model/film/film.view-model';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';

export class FilmManyResponse {
  @ApiProperty({
    type: [FilmVM],
  })
  public readonly film: FilmVM[];

  @ApiProperty({
    type: PaginationMetaVM,
  })
  public readonly meta: PaginationMetaVM;

  public constructor(
    data: FilmWithIdDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.film = data.map((film) => new FilmVM(film));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
