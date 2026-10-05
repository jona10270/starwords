import type { UseCase } from "@/core/lib"

import type { AuthSessionStorage } from "../domain/AuthSessionStorage"
import type { AuthStore } from "./authStore"

interface LogoutUseCaseProps {
    authSessionStorage: AuthSessionStorage;
    authStore: AuthStore;
}

export class LogoutUseCase implements UseCase<void, void> {
    private readonly authSessionStorage: AuthSessionStorage;
    private readonly authStore: AuthStore;

    constructor({authSessionStorage, authStore}: LogoutUseCaseProps) {
        this.authSessionStorage = authSessionStorage;
        this.authStore = authStore;
    }

    async execute(): Promise<void> {
        // Borro el token guardado en localstorage
        this.authSessionStorage.clear()
        // Cambio el estado a UnauthenticatedAuthState
        this.authStore.getState().clearSession();
    }

}