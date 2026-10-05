import type { HttpClient } from "@/core/modules/common";
import type { LoginCredentials, RegisterData } from "../domain/AuthCredentials";
import type { AuthRepository } from "../domain/AuthRepository";
import type { AuthSession } from "../domain/AuthSession";
import type { LoginResponseDTO, MeResponseDTO } from "./AuthDTO";
import { AuthMapper } from "./AuthMapper";
import { AuthErrorMapper } from "./AuthErrorMapper";
import type { AuthUser } from "../domain/AuthUser";

// Lo que necesito para hablar con el backend
interface AuthHTTPRepositoryProps {
    httpClient: HttpClient;
}

// Cumplo el puerto AuthRepository hablando con el backend por http
export class AuthHTTPRepository implements AuthRepository {
    private readonly httpClient: HttpClient;

    constructor({ httpClient }: AuthHTTPRepositoryProps) {
        this.httpClient = httpClient;
    }

    // Mando las credenciales al backend y traduzco su respuesta a una sesión
    async login(credentials: LoginCredentials): Promise<AuthSession> {
        let data: LoginResponseDTO;
        try {
            // Hago la peticion al backend
            data = await this.httpClient.post<LoginResponseDTO>(
                '/auth/login',
                AuthMapper.toLoginRequestDTO(credentials),
            );
        } catch (error) {
            throw AuthErrorMapper.toLoginError(error)
        }
        // Traduzco lo que me devuelve el backend
        return AuthMapper.toAuthSession(data);
    }
    
    // Creo el usuario en el backend y no necesito nada de la respuesta
    async register(data: RegisterData): Promise<void> {
        try {
            await this.httpClient.post(
                '/users',
                AuthMapper.toRegisterRequestDTO(data),
            );
        } catch (error) {
            throw AuthErrorMapper.toRegisterError(error);
        }
    }

    async getMe(): Promise<AuthUser> {
        let data: MeResponseDTO;

        data = await this.httpClient.get<MeResponseDTO>(
            'users/me'
        )

        return AuthMapper.toAuthUser(data)
    }
        
}