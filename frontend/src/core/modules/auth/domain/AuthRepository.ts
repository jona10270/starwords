import type { LoginCredentials, RegisterData } from "./AuthCredentials";
import type { AuthSession } from "./AuthSession";
import type { AuthUser } from "./AuthUser";

// Creo el puerto de fuera para el repositorio de autenticación
export interface AuthRepository {
    login(credentials: LoginCredentials): Promise<AuthSession>;
    register(data: RegisterData): Promise<void>;
    getMe(): Promise<AuthUser>
}