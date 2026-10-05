import { ApiProperty } from '@nestjs/swagger';
import { FavoriteVM } from '../../../model/favorite.view-model';
import { FavoriteModel } from '@app/modules/favorites/model/favorites.model';

export class FavoriterResponse {
  @ApiProperty({
    type: FavoriteVM,
  })
  public readonly favorite: FavoriteVM;

  public constructor(data: FavoriteModel) {
    this.favorite = new FavoriteVM(data);
  }
}
