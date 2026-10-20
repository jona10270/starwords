import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { PlanetManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/planet/planet.client.many.response';
import {
  PlanetAllDto,
  PlanetDetailDto,
  PlanetWithIdDto,
} from './dto/planet.all.dto';
import { PlanetSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/planet/planet.client.single.response';
import { PlanetSingleDto } from './dto/planet.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';
import { filterByText } from '../common/filter-by-text';
import { ResourceRefService } from '../common/resource-ref.service';

@Injectable()
export class PlanetService {
  constructor(
    private readonly swapiRequest: SwapiRequest,
    private readonly resourceRefService: ResourceRefService,
  ) {}

  public async getPlanets(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PlanetManyResponse> {
    const data = await this.swapiRequest.request<PlanetAllDto[]>('/planets');

    // Ahora todos los planetas tienen su id
    const planets = data.map((planet) => ({
      ...planet,
      id: getIdFromUrl(planet.url),
    }));

    // Filtro antes de paginar para que el total cuente solo lo encontrado
    const found = filterByText(planets, search, (planet) => planet.name);
    const { items, total } = paginate(found, page, limit);

    const resolvedPlanets = await Promise.all(
      items.map((planet) => this.resolveRelations(planet)),
    );

    return new PlanetManyResponse(resolvedPlanets, total, page, limit);
  }

  public async getPlanet(planetId: string): Promise<PlanetSingleResponse> {
    const data = await this.swapiRequest.request<PlanetSingleDto>(
      `/planets/${planetId}`,
    );

    const planet = await this.resolveRelations({
      ...data,
      id: getIdFromUrl(data.url),
    });

    return new PlanetSingleResponse(planet);
  }

  // Cambio las urls de las películas y de los residentes por su id y nombre
  private async resolveRelations(
    planet: PlanetWithIdDto,
  ): Promise<PlanetDetailDto> {
    return {
      ...planet,
      films: await Promise.all(
        planet.films.map((url) =>
          this.resourceRefService.getTitleRef('films', url),
        ),
      ),
      residents: await Promise.all(
        planet.residents.map((url) =>
          this.resourceRefService.getNameRef('people', url),
        ),
      ),
    };
  }
}
