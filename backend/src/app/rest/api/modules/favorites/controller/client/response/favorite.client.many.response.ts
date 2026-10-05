import { ApiProperty } from '@nestjs/swagger';
import { FavoriteVM } from '../../../model/favorite.view-model';

export class PaginationFavoriteMetaVM {
  @ApiProperty({ type: Number, example: 100 })
  public total: number;

  @ApiProperty({ type: Number, example: 1 })
  public page: number;

  @ApiProperty({ type: Number, example: 10 })
  public limit: number;

  @ApiProperty({ type: Number, example: 15 })
  public totalPage: number;

  public constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPage = Math.ceil(total / limit);
  }
}

export class FavoriteManyResponse {
  @ApiProperty({ type: [FavoriteVM] })
  public favorites: FavoriteVM[];

  @ApiProperty({ type: PaginationFavoriteMetaVM })
  public meta: PaginationFavoriteMetaVM;

  public constructor(
    data: FavoriteVM[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.favorites = data.map((favorite) => new FavoriteVM(favorite));
    this.meta = new PaginationFavoriteMetaVM(total, page, limit);
  }
}
