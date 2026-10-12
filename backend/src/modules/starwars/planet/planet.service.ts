import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { PlanetManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/planet/planet.client.many.response';
import { PlanetAllDto } from './dto/planet.all.dto';
import { PlanetSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/planet/planet.client.single.response';
import { PlanetSingleDto } from './dto/planet.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';

@Injectable()
export class PlanetService {
  constructor(private readonly swapiRequest: SwapiRequest) {}

  public async getPlanets(): Promise<PlanetManyResponse> {
    const data = await this.swapiRequest.request<PlanetAllDto[]>('/planets');

    const planets = data.map((planet) => ({
      ...planet,
      id: getIdFromUrl(planet.url),
    }));

    return new PlanetManyResponse(planets);
  }

  public async getPlanet(planetId: string): Promise<PlanetSingleResponse> {
    const data = await this.swapiRequest.request<PlanetSingleDto>(
      `/planets/${planetId}`,
    );

    const planet = {
      ...data,
      id: getIdFromUrl(data.url),
    };

    return new PlanetSingleResponse(planet);
  }
}
