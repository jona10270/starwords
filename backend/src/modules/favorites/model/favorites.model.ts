import { ResourceTypeEnum } from '../enum/resource-type.enum';

// Model for entity representing a favorite
export interface FavoriteModel {
  id: string;
  userId: string;
  resourceId: string;
  resourceType: ResourceTypeEnum;
  createdAt: Date;
}

// Favorito con el nombre del registro de swapi para pintarlo en mi listado
export interface FavoriteWithNameModel extends FavoriteModel {
  name: string | null;
}
