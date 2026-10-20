import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { SpecieManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/specie/specie.client.many.response';
import {
  SpeciesAllDto,
  SpecieDetailDto,
  SpecieWithIdDto,
} from './dto/specie.all.dto';
import { SpecieSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/specie/specie.client.single.response';
import { SpeciesSingleDto } from './dto/specie.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';
import { filterByText } from '../common/filter-by-text';
import { ResourceRefService } from '../common/resource-ref.service';

@Injectable()
export class SpecieService {
  constructor(
    private readonly swapiRequest: SwapiRequest,
    private readonly resourceRefService: ResourceRefService,
  ) {}

  public async getSpecies(
    page: number,
    limit: number,
    search?: string,
  ): Promise<SpecieManyResponse> {
    const data = await this.swapiRequest.request<SpeciesAllDto[]>('/species');

    const species = data.map((specie) => ({
      ...specie,
      id: getIdFromUrl(specie.url),
    }));

    // Filtro antes de paginar para que el total cuente solo lo encontrado

    const found = filterByText(species, search, (specie) => specie.name);
    const { items, total } = paginate(found, page, limit);

    const detailSpecies = await Promise.all(
      items.map((specie) => this.resolveRelation(specie)),
    );

    return new SpecieManyResponse(detailSpecies, total, page, limit);
  }

  public async getSpecie(specieId: string): Promise<SpecieSingleResponse> {
    const data = await this.swapiRequest.request<SpeciesSingleDto>(
      `/species/${specieId}`,
    );

    const specie = await this.resolveRelation({
      ...data,
      id: getIdFromUrl(data.url),
    });

    return new SpecieSingleResponse(specie);
  }

  // Ejecuto todas las peticiones en paralelo para ganar mas velocidad
  private async resolveRelation(
    specie: SpecieWithIdDto,
  ): Promise<SpecieDetailDto> {
    const [homeworld, people, films] = await Promise.all([
      // Hay especies sin planeta de origen
      specie.homeworld
        ? this.resourceRefService.getNameRef('planets', specie.homeworld)
        : null,
      Promise.all(
        specie.people.map((url) =>
          this.resourceRefService.getNameRef('people', url),
        ),
      ),
      Promise.all(
        specie.films.map((url) =>
          this.resourceRefService.getTitleRef('films', url),
        ),
      ),
    ]);

    return {
      ...specie,
      homeworld,
      people,
      films,
    };
  }
}
