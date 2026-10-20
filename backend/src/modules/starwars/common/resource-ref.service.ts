import { Injectable } from '@nestjs/common';
import { SwapiRequest } from './swapi.service';
import { ResourceNameDto, ResourceTitleDto } from './resource-ref.dto';
import { getIdFromUrl } from './get-id-from-url';

type NamedResource =
  'people' | 'planets' | 'species' | 'vehicles' | 'starships' | 'films';

@Injectable()
export class ResourceRefService {
  constructor(private readonly swapiRequest: SwapiRequest) {}

  public async getNameRef(
    resource: NamedResource,
    url: string,
  ): Promise<ResourceNameDto> {
    const id = getIdFromUrl(url);

    const { name } = await this.swapiRequest.request<{ name: string }>(
      `/${resource}/${id}`,
    );

    return { id, name };
  }

  // Saco el id y el título de una película a partir de su url
  public async getTitleRef(
    resource: NamedResource,
    url: string,
  ): Promise<ResourceTitleDto> {
    const id = getIdFromUrl(url);

    const { title } = await this.swapiRequest.request<{ title: string }>(
      `/${resource}/${id}`,
    );

    return { id, title };
  }
}
