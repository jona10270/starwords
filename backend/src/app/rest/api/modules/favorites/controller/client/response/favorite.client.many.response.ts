import { ApiProperty } from '@nestjs/swagger';
import { FavoriteVM } from '../../../model/favorite.view-model';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';

export class FavoriteManyResponse {
  @ApiProperty({ type: [FavoriteVM] })
  public favorites: FavoriteVM[];

  @ApiProperty({ type: PaginationMetaVM })
  public meta: PaginationMetaVM;

  public constructor(
    data: FavoriteVM[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.favorites = data.map((favorite) => new FavoriteVM(favorite));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
