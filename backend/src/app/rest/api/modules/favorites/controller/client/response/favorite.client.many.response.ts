import { ApiProperty } from '@nestjs/swagger';
import { FavoriteWithNameVM } from '../../../model/favorite.view-model';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';
import { FavoriteWithNameModel } from '@app/modules/favorites/model/favorites.model';

export class FavoriteManyResponse {
  @ApiProperty({ type: [FavoriteWithNameVM] })
  public favorites: FavoriteWithNameVM[];

  @ApiProperty({ type: PaginationMetaVM })
  public meta: PaginationMetaVM;

  public constructor(
    data: FavoriteWithNameModel[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.favorites = data.map((favorite) => new FavoriteWithNameVM(favorite));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
