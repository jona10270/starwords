import { ResourceTypeEnum } from '../enum/resource-type.enum';

export interface FavoritesAddDto {
  userId: string;
  resourceId: string;
  resourceType: ResourceTypeEnum;
}
