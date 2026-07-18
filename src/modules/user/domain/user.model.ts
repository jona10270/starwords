import { UserRole } from '@app/shared/nestjs-auth/domain/user-role'

// El interface sirve para declara el modelo de un objeto 
export interface UserModel {
    id: string
    email: string;
    username: string;
    password: string;    
    role: UserRole;
    activated: boolean;
}