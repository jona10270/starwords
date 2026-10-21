import { ApiProperty } from '@nestjs/swagger';
import { ResourceTypeEnum } from '@app/modules/favorites/enum/resource-type.enum';
import {
  FavoriteModel,
  FavoriteWithNameModel,
} from '@app/modules/favorites/model/favorites.model';

export class FavoriteVM {
  @ApiProperty({ type: String, example: '1' })
  public id: string;

  @ApiProperty({ type: String, example: '1' })
  public userId: string;

  @ApiProperty({ type: String, example: '1' })
  public resourceId: string;

  @ApiProperty({ type: String, example: 'PEOPLE' })
  public resourceType: ResourceTypeEnum;

  @ApiProperty({ type: Date, example: '2023-01-01T00:00:00.000Z' })
  public createdAt: Date;

  public constructor(favorite: FavoriteModel) {
    this.id = favorite.id;
    this.userId = favorite.userId;
    this.resourceId = favorite.resourceId;
    this.resourceType = favorite.resourceType;
    this.createdAt = favorite.createdAt;
  }
}

// Favorito de mi listado con el nombre del registro y null si swapi no lo encuentra
export class FavoriteWithNameVM extends FavoriteVM {
  @ApiProperty({ type: String, nullable: true, example: 'Luke Skywalker' })
  public name: string | null;

  public constructor(favorite: FavoriteWithNameModel) {
    super(favorite);
    this.name = favorite.name;
  }
}
