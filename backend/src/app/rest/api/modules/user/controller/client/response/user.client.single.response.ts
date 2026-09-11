import { ApiProperty } from '@nestjs/swagger';

import { UserModel } from '@app/modules/user/domain/user.model';

import { UserVM } from '@app/app/rest/api/modules/user/model/user.view-model';

export class UsersClientResponse {
  @ApiProperty({ type: UserVM })
  public readonly user: UserVM;

  public constructor(data: UserModel) {
    this.user = new UserVM(data);
  }
}
