import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { FilmAllDto, FilmWithIdDto, FilmDetailDto } from './dto/film.all.dto';
import { FilmManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/film/film.client.many.response';
import { FilmSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/film/film.client.single.response';
import { FilmSingleDto } from './dto/film.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';
import { filterByText } from '../common/filter-by-text';
import { ResourceRefService } from '../common/resource-ref.service';

@Injectable()
export class FilmService {
  constructor(
    private readonly swapiRequest: SwapiRequest,
    private readonly resourceRefService: ResourceRefService,
  ) {}

  // Get all films of the swapi
  public async getAllFilms(
    page: number,
    limit: number,
    search?: string,
  ): Promise<FilmManyResponse> {
    const data = await this.swapiRequest.request<FilmAllDto[]>('/films');

    const films = data.map((film) => ({
      ...film,
      id: getIdFromUrl(film.url),
    }));

    // Filtro antes de paginar para que el total cuente solo lo encontrado
    const found = filterByText(films, search, (film) => film.title);
    const { items, total } = paginate(found, page, limit);

    const detailFilms = await Promise.all(
      items.map((film) => this.resolveRelation(film)),
    );

    return new FilmManyResponse(detailFilms, total, page, limit);
  }

  // Get one filmm
  public async getFilm(filmId: string): Promise<FilmSingleResponse> {
    const data = await this.swapiRequest.request<FilmSingleDto>(
      `/films/${filmId}`,
    );
    const film = await this.resolveRelation({
      ...data,
      id: getIdFromUrl(data.url),
    });
    return new FilmSingleResponse(film);
  }

  private async resolveRelation(film: FilmWithIdDto): Promise<FilmDetailDto> {
    const [characters, planets, starships] = await Promise.all([
      Promise.all(
        film.characters.map((url) =>
          this.resourceRefService.getNameRef('people', url),
        ),
      ),
      Promise.all(
        film.planets.map((url) =>
          this.resourceRefService.getNameRef('planets', url),
        ),
      ),
      Promise.all(
        film.starships.map((url) => this.resourceRefService.getNameRef('starships', url))
      )
    ]);
    return {
      ...film,
      characters,
      planets,
      starships,
    };
  }
}
