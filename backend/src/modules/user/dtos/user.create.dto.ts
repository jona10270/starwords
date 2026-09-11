import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';

// Lo que nesesitamos para que cree un usuario
export interface UserCreateDto {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}
