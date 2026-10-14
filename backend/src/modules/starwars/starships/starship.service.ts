import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { StarshipManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/starship/starship.client.many.response';
import { StarshipAllDto } from './dto/starship.all.dto';
import { StarshipSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/starship/starship.client.single.response';
import { getIdFromUrl } from '../common/get-id-from-url';
import { StarshipSingleDto } from './dto/starship.single.dto';
import { paginate } from '../common/paginate';
import { filterByText } from '../common/filter-by-text';

@Injectable()
export class StarshipService {
  constructor(private readonly swapiRequest: SwapiRequest) {}

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

    const found = filterByText(starships, search, (starship) => starship.name)
    const { items, total } = paginate(starships, page, limit);
    return new StarshipManyResponse(items, total, page, limit);
  }

  public async getSingleStarship(
    starShipId: string,
  ): Promise<StarshipSingleResponse> {
    const data = await this.swapiRequest.request<StarshipSingleDto>(
      `/starships/${starShipId}`,
    );

    const starship = {
      ...data,
      id: getIdFromUrl(data.url),
    };

    return new StarshipSingleResponse(starship);
  }
}
