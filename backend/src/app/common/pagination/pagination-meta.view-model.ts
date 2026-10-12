import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaVM {
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
