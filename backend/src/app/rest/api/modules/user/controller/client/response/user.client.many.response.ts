import { ApiProperty } from '@nestjs/swagger';

import { UserModel } from '@app/modules/user/domain/user.model';

import { UserVM } from '@app/app/rest/api/modules/user/model/user.view-model';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';

export class UserClientManyResponse {
  @ApiProperty({ type: [UserVM] })
  public readonly users: UserVM[];

  @ApiProperty({ type: PaginationMetaVM })
  public readonly meta: PaginationMetaVM;

  public constructor(
    data: UserModel[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.users = data.map((user) => new UserVM(user));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
