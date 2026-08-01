import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';

// Dto para editar el usuario
export interface UserEditDto {
    email?: string;
    username?: string;
    password?: string;
    role?: UserRole;
};