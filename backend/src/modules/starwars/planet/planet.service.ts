import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { PlanetManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/planet/planet.client.many.response';
import { PlanetAllDto } from './dto/planet.all.dto';
import { PlanetSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/planet/planet.client.single.response';
import { PlanetSingleDto } from './dto/planet.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';
import { filterByText } from '../common/filter-by-text';
import { FilmService } from '../film/film.service';

@Injectable()
export class PlanetService {
  constructor(
    private readonly swapiRequest: SwapiRequest,
    private readonly filmsService: FilmService,
  ) {}

  public async getPlanets(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PlanetManyResponse> {
    const data = await this.swapiRequest.request<PlanetAllDto[]>('/planets');

    const planets = await Promise.all(
      data.map(async (planet) => {
        const filmsIds = planet.films.map((filmsIds => getIdFromUrl(filmsIds)))

        const films = await Promise.all(
          filmsIds.map((filmId) => this.filmsService.getFilm(filmId))
        ) 

        const filmsRef = films.map((response) => ({
          id: response.film.id,
          title: response.film.title,
        }))

        return {
          ...planet,
          id: getIdFromUrl(planet.url),
          films: filmsRef
        }
      })
    )

    // Filtro antes de paginar para que el total cuente solo lo encontrado
    const found = filterByText(planets, search, (planet) => planet.name);
    const { items, total } = paginate(found, page, limit);

    return new PlanetManyResponse(items, total, page, limit);
  }

  public async getPlanet(planetId: string): Promise<PlanetSingleResponse> {
    const data = await this.swapiRequest.request<PlanetSingleDto>(
      `/planets/${planetId}`,
    );

    // Consigo los ids de las peliculas
    const filmsIds = data.films.map((urlId) => getIdFromUrl(urlId));

    const films = await Promise.all(
      filmsIds.map((filmId) => this.filmsService.getFilm(filmId))
    )

    const filmsRef = films.map((response) => ({
      id: response.film.id,
      title: response.film.title,
    }))

    const planet = {
      ...data,
      id: getIdFromUrl(data.url),
      films: filmsRef,
    };
    console.log(`Esta es la lista que devuelve films:`)
    console.log(filmsRef)

    return new PlanetSingleResponse(planet);
  }
}
