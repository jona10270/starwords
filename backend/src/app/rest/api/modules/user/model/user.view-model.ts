import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '@app/modules/user/domain/user.model';
import { UserRole, userRoles } from '@app/shared/nestjs-auth/domain/user-role';

export class UserVM {
  @ApiProperty({ type: String, example: '507f191e810c19729de860ea' })
  public readonly id: string;

  @ApiProperty({ type: String, example: 'username' })
  public readonly username?: string;

  @ApiProperty({ type: String, example: 'mail@example.org' })
  public readonly email?: string;

  @ApiProperty({ type: String, enum: userRoles, example: UserRole.MAPPER })
  public readonly role?: UserRole;

  @ApiProperty({ type: Boolean, example: true })
  public readonly activated: boolean;

  public constructor(user: UserModel) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.activated = user.activated;
  }
}
