import type { UseCase } from "@/core/lib";

import type { LoginCredentials } from "../domain/AuthCredentials";
import type { AuthRepository } from "../domain/AuthRepository";
import type { AuthSessionStorage } from "../domain/AuthSessionStorage";
import type { AuthStore } from "./authStore";

// Las piezas que necesita el login para funcionar
interface LoginCaseProps {
    authRepository: AuthRepository;
    authSessionStorage: AuthSessionStorage;
    authStore: AuthStore;
}

export class LoginUseCase implements UseCase<LoginCredentials, void > {
    private readonly authRepository: AuthRepository;
    private readonly authSessionStorage: AuthSessionStorage;
    private readonly authStore: AuthStore;

    constructor ({ authRepository, authSessionStorage, authStore}: LoginCaseProps) {
        this.authRepository = authRepository;
        this.authSessionStorage = authSessionStorage;
        this.authStore = authStore;
    }

    async execute(credentials: LoginCredentials): Promise<void> {
        // Pido el login al backend y me devuelve el token y cuando caduca
        const session = await this.authRepository.login(credentials);
        // Guardo la session en el navegador para que sobreviva a la recarga
        this.authSessionStorage.save(session);
        // Pido mi datos de usuario actual al backend con toda mi info de usario
        const user = await this.authRepository.getMe();
        // Cambio el estado a autenticado y aviso a toda la app
        this.authStore.getState().setSession(session, user);
    }

}

