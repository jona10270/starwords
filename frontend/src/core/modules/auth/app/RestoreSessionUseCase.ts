import type { UseCase } from "@/core/lib";
import type { AuthRepository } from "../domain/AuthRepository";

import type { AuthSessionStorage } from "../domain/AuthSessionStorage";
import type { AuthStore } from "./authStore";

interface RestoreSessionUseCaseProps {
    authSessionStorage: AuthSessionStorage;
    authStore: AuthStore
    authRepository: AuthRepository
}

export class RestoreSessionUseCase implements UseCase<void, void> {
    private readonly authSessionStorage: AuthSessionStorage;
    private readonly authStore: AuthStore;
    private readonly authRepository: AuthRepository;

    constructor({ authSessionStorage, authStore, authRepository }: RestoreSessionUseCaseProps) {
        this.authSessionStorage = authSessionStorage;
        this.authStore = authStore;
        this.authRepository = authRepository;
    }

    async execute(): Promise<void> {
        // Miro si hay una session guardada
        const session = this.authSessionStorage.get();

        // Si no hay niguna session o la session que haya caducado limpimaos el localstorage y el estado
        if(!session || session.expiresAt <= Date.now()) {
            this.authSessionStorage.clear();
            this.authStore.getState().clearSession();
            return;
        };

        // Si falla no dejo la seesion a medias
        try {
            // Le pido al backend quin soy yo para comporbar el token
            const user = await this.authRepository.getMe();
            // Si hay aluna session y no esta expirada la meto en el store
            this.authStore.getState().setSession(session, user);
        } catch {
            this.authSessionStorage.clear();
            this.authStore.getState().clearSession();
        }
    }

}