import { ApiProperty } from '@nestjs/swagger';

import { FilmWithIdDto } from '@app/modules/starwars/film/dto/film.all.dto';
import { FilmVM } from '../../../../model/film/film.view-model';

export class FilmManyResponse {
  @ApiProperty({
    type: [FilmVM],
  })
  public readonly film: FilmVM[];

  public constructor(data: FilmWithIdDto[]) {
    this.film = data.map((film) => new FilmVM(film));
  }
}
