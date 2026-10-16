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
import { PeopleService } from '../people/people.service';

@Injectable()
export class PlanetService {
  constructor(
    private readonly swapiRequest: SwapiRequest,
    private readonly filmsService: FilmService,
    private readonly residentsService: PeopleService,
  ) {}

  public async getPlanets(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PlanetManyResponse> {
    const data = await this.swapiRequest.request<PlanetAllDto[]>('/planets');

    // Busco los films id y los residents id
    const planets = await Promise.all(
      data.map(async (planet) => {
        // Busco los filmsId
        const filmsIds = planet.films.map((filmsIds) => getIdFromUrl(filmsIds));
        // Busco los residentsId
        const residentsIds = planet.residents.map((residentsIds) =>
          getIdFromUrl(residentsIds),
        );

        const films = await Promise.all(
          filmsIds.map((filmId) => this.filmsService.getFilm(filmId)),
        );

        const residents = await Promise.all(
          residentsIds.map((residentId) =>
            this.residentsService.getPeople(residentId),
          ),
        );

        const residentRef = residents.map((response) => ({
          id: response.people.id,
          name: response.people.name,
        }));

        const filmsRef = films.map((response) => ({
          id: response.film.id,
          title: response.film.title,
        }));

        return {
          ...planet,
          id: getIdFromUrl(planet.url),
          films: filmsRef,
          residents: residentRef,
        };
      }),
    );

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
    const residentsIds = data.residents.map((urlId) => getIdFromUrl(urlId));

    const films = await Promise.all(
      filmsIds.map((filmId) => this.filmsService.getFilm(filmId)),
    );

    const residents = await Promise.all(
      residentsIds.map((residentId) =>
        this.residentsService.getPeople(residentId),
      ),
    );

    const filmsRef = films.map((response) => ({
      id: response.film.id,
      title: response.film.title,
    }));

    const residentRef = residents.map((response) => ({
      id: response.people.id,
      name: response.people.name,
    }));

    const planet = {
      ...data,
      id: getIdFromUrl(data.url),
      films: filmsRef,
      residents: residentRef,
    };
    return new PlanetSingleResponse(planet);
  }
}
