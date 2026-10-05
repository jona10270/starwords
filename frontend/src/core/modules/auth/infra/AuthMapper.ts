import type { LoginResponseDTO, LoginRequestDTO, RegisterRequestDTO, MeResponseDTO } from "./AuthDTO"
import type { AuthSession } from "../domain/AuthSession"
import type { LoginCredentials, RegisterData } from "../domain/AuthCredentials"
import type { AuthUser } from "../domain/AuthUser"

export const AuthMapper = {
    // Paso los segundos que dura el token a la hora exacta en que caduca
    toAuthSession: (dto: LoginResponseDTO): AuthSession => ({
        accessToken: dto.auth.accessToken ,
        expiresAt: Date.now() + dto.auth.expiresIn * 1000,
    }),

    // Preparo el cuerpo del login con solo los campos que acepta el backend para hacer el login
    toLoginRequestDTO: (credentials: LoginCredentials): LoginRequestDTO => ({
        email: credentials.email,
        password: credentials.password,
    }),

    // Preparo el cuerpo del registro de con los campso que acepta el backend para el envio para registar un usuario
    toRegisterRequestDTO: (data: RegisterData): RegisterRequestDTO => ({
        username: data.username,
        email: data.email,
        password: data.password
    }),

    toAuthUser: (dto: MeResponseDTO): AuthUser => ({
        id: dto.user.id,
        username: dto.user.username,
        email: dto.user.email,
        role: dto.user.role,
    })
}