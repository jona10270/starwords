import { ApiProperty } from '@nestjs/swagger';
import { FavoriteVM } from '../../../model/favorite.view-model';

export class FavoriteStatusResponse {
  @ApiProperty({ type: [FavoriteVM] })
  public favorite: FavoriteVM[];

  public constructor(data: FavoriteVM[]) {
    this.favorite = data.map((favorite) => new FavoriteVM(favorite));
  }
}
