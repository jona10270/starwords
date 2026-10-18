import { Injectable } from '@nestjs/common';
import { SwapiRequest } from './swapi.service';
import { ResourceNameDto } from './resource-ref.dto';
import { getIdFromUrl } from './get-id-from-url';

type NamedResource =
  'people' | 'planets' | 'species' | 'vehicles' | 'starships';

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
}
