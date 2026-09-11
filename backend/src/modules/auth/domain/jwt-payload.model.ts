import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';

export interface JwtPayloadModel {
  sub: string;
  role: UserRole;
}
