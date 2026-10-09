import { ApiProperty } from '@nestjs/swagger';

import { FilmVM } from '../../../../model/film/film.view-model';
import { FilmWithIdDto } from '@app/modules/starwars/film/dto/film.all.dto';

export class FilmSingleResponse {
  @ApiProperty({
    type: FilmVM,
  })
  public readonly film: FilmVM;

  public constructor(data: FilmWithIdDto) {
    this.film = new FilmVM(data);
  }
}
