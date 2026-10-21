import { ApiProperty } from '@nestjs/swagger';
import { FavoriteVM } from '../../../model/favorite.view-model';

export class FavoriteStatusResponse {
  @ApiProperty({ type: [FavoriteVM] })
  public favorites: FavoriteVM[];

  public constructor(data: FavoriteVM[]) {
    this.favorites = data.map((favorite) => new FavoriteVM(favorite));
  }
}
