import { Injectable, NotFoundException } from '@nestjs/common';
import { SwapiRequest } from './swapi.service';
import { ResourceNameDto, ResourceTitleDto } from './resource-ref.dto';
import { getIdFromUrl } from './get-id-from-url';

export type NamedResource =
  'people' | 'planets' | 'species' | 'vehicles' | 'starships' | 'films';

// Lo minimo que necesito de cada registro de swapi para sacar su nombre
interface SwapiItem {
  url: string;
  name?: string;
  title?: string;
}

@Injectable()
export class ResourceRefService {
  // Guardo cada coleccion la primera vez que la pido y la reutilizo siempre
  private readonly collections = new Map<
    NamedResource,
    Promise<Map<string, SwapiItem>>
  >();

  constructor(private readonly swapiRequest: SwapiRequest) {}

  public async getNameRef(
    resource: NamedResource,
    url: string,
  ): Promise<ResourceNameDto> {
    const id = getIdFromUrl(url);
    const item = await this.findById(resource, id);

    return { id, name: item.name ?? '' };
  }

  // Saco el id y el título de una película a partir de su url
  public async getTitleRef(
    resource: NamedResource,
    url: string,
  ): Promise<ResourceTitleDto> {
    const id = getIdFromUrl(url);
    const item = await this.findById(resource, id);

    return { id, title: item.title ?? '' };
  }

  // Saco el nombre o el título de un registro cuando ya tengo su id
  public async getNameById(
    resource: NamedResource,
    id: string,
  ): Promise<string> {
    const item = await this.findById(resource, id);

    return item.name ?? item.title ?? '';
  }

  // Busco el registro en la coleccion entera en vez de pedirlo a swapi
  private async findById(
    resource: NamedResource,
    id: string,
  ): Promise<SwapiItem> {
    const collection = await this.getCollection(resource);
    const item = collection.get(id);

    if (!item) {
      throw new NotFoundException(`The ${resource} ${id} does not exist`);
    }
    return item;
  }

  // Pido la coleccion una sola vez y si falla la borro para reintentar la proxima
  private getCollection(
    resource: NamedResource,
  ): Promise<Map<string, SwapiItem>> {
    const cached = this.collections.get(resource);
    if (cached) return cached;

    const request = this.swapiRequest
      .request<SwapiItem[]>(`/${resource}`)
      .then(
        (items) => new Map(items.map((item) => [getIdFromUrl(item.url), item])),
      );

    request.catch(() => this.collections.delete(resource));
    this.collections.set(resource, request);
    return request;
  }
}
