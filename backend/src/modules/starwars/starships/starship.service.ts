import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { StarshipManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/starship/starship.client.many.response';
import {
  StarshipAllDto,
  StarshipDetailDto,
  StarshipWithIdDto,
} from './dto/starship.all.dto';
import { StarshipSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/starship/starship.client.single.response';
import { getIdFromUrl } from '../common/get-id-from-url';
import { StarshipSingleDto } from './dto/starship.single.dto';
import { paginate } from '../common/paginate';
import { filterByText } from '../common/filter-by-text';
import { ResourceRefService } from '../common/resource-ref.service';

@Injectable()
export class StarshipService {
  constructor(
    private readonly swapiRequest: SwapiRequest,
    private readonly resourceRefService: ResourceRefService,
  ) {}

  public async getAllStarships(
    page: number,
    limit: number,
    search?: string,
  ): Promise<StarshipManyResponse> {
    const data =
      await this.swapiRequest.request<StarshipAllDto[]>('/starships');

    const starships = data.map((starship) => ({
      ...starship,
      id: getIdFromUrl(starship.url),
    }));

    // Filtro antes de paginar para que el total cuente solo lo encontrado
    const found = filterByText(starships, search, (starship) => starship.name);
    const { items, total } = paginate(found, page, limit);

    const detailStarship = await Promise.all(
      items.map((starship) => this.resolveRelation(starship)),
    );

    return new StarshipManyResponse(detailStarship, total, page, limit);
  }

  public async getSingleStarship(
    starShipId: string,
  ): Promise<StarshipSingleResponse> {
    const data = await this.swapiRequest.request<StarshipSingleDto>(
      `/starships/${starShipId}`,
    );

    const starship = await this.resolveRelation({
      ...data,
      id: getIdFromUrl(data.url),
    });
    return new StarshipSingleResponse(starship);
  }

  // Ejecuto todas las funciones en paralelo para ganar mas velocidad
  private async resolveRelation(
    starship: StarshipWithIdDto,
  ): Promise<StarshipDetailDto> {
    const [pilots, films] = await Promise.all([
      Promise.all(
        starship.pilots.map((url) =>
          this.resourceRefService.getNameRef('people', url),
        ),
      ),
      Promise.all(
        starship.films.map((url) =>
          this.resourceRefService.getTitleRef('films', url),
        ),
      ),
    ]);

    return {
      ...starship,
      pilots,
      films,
    };
  }
}
