import { ResourceTypeEnum } from '../enum/resource-type.enum';

// Model for entity representing a favorite
export interface FavoriteModel {
  id: string;
  userId: string;
  resourceId: string;
  resourceType: ResourceTypeEnum;
  createdAt: Date;
}
