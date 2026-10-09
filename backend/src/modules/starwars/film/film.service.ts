import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { FilmAllDto } from './dto/film.all.dto';
import { FilmManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/film/film.client.many.response';
import { FilmSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/film/film.client.single.response';
import { FilmSingleDto } from './dto/film.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';

@Injectable()
export class FilmService {
  constructor(private readonly swapiRequest: SwapiRequest) {}

  // Get all films of the swapi
  public async getAllFilms(): Promise<FilmManyResponse> {
    const data = await this.swapiRequest.request<FilmAllDto[]>('/films');

    const films = data.map((film) => ({
      ...film,
      id: getIdFromUrl(film.url),
    }));

    return new FilmManyResponse(films);
  }

  public async getFilm(filmId: string): Promise<FilmSingleResponse> {
    const data = await this.swapiRequest.request<FilmSingleDto>(
      `/films/${filmId}`,
    );
    const film = {
      ...data,
      id: getIdFromUrl(data.url),
    };
    return new FilmSingleResponse(film);
  }
}
