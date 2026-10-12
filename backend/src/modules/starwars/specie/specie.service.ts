import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { SpecieManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/specie/specie.client.many.response';
import { SpeciesAllDto } from './dto/specie.all.dto';
import { SpecieSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/specie/specie.client.single.response';
import { SpeciesSingleDto } from './dto/specie.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';

@Injectable()
export class SpecieService {
  constructor(private readonly swapiRequest: SwapiRequest) {}

  public async getSpecies(
    page: number,
    limit: number,
  ): Promise<SpecieManyResponse> {
    const data = await this.swapiRequest.request<SpeciesAllDto[]>('/species');

    const species = data.map((specie) => ({
      ...specie,
      id: getIdFromUrl(specie.url),
    }));

    const { items, total } = paginate(species, page, limit);
    return new SpecieManyResponse(items, total, page, limit);
  }

  public async getSpecie(specieId: string): Promise<SpecieSingleResponse> {
    const data = await this.swapiRequest.request<SpeciesSingleDto>(
      `/species/${specieId}`,
    );

    const specie = {
      ...data,
      id: getIdFromUrl(data.url),
    };

    return new SpecieSingleResponse(specie);
  }
}
