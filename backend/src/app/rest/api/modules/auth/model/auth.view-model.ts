import { ApiProperty } from '@nestjs/swagger';
import { AuthTokenModel } from '@app/modules/auth/domain/auth-token.model';

export class AuthTokenVM {
  @ApiProperty({ type: String, example: 'Bearer eyJhb' })
  public readonly accessToken: string; // Token de accesso

  @ApiProperty({ type: String, example: 'Bearer' })
  public readonly tokenType: string; // Tipo de token

  @ApiProperty({ type: Number, example: 900 })
  public readonly expiresIn: number; // Segundos que dura el token

  public constructor(authToken: AuthTokenModel) {
    this.accessToken = authToken.accessToken;
    this.tokenType = 'Bearer';
    this.expiresIn = authToken.expiresIn;
  }
}
