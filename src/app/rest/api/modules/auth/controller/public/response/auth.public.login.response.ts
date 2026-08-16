import { AuthTokenVM } from '@app/app/rest/api/modules/auth/model/auth.view-model';
import { ApiProperty } from '@nestjs/swagger';
import { AuthTokenModel } from '@app/modules/auth/domain/auth-token.model';

export class AuthPublicLoginResponse {
  @ApiProperty({ type: AuthTokenVM })
  public readonly auth: AuthTokenVM;

  public constructor(data: AuthTokenModel) {
    this.auth = new AuthTokenVM(data);
  }
}
