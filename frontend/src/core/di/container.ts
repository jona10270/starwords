import { config } from "@/core/config";
import {
    createAuthStore,
    BrowserSessionStorage,
    LogoutUseCase,
    AuthHTTPRepository,
    LoginUseCase,
    RegisterUseCase,
    RestoreSessionUseCase,
} from "@/core/modules/auth";

import { HttpClient } from "@/core/modules/common";

export const authStore = createAuthStore();

// Decido donde se guardara la session del navegador
const authSessionStorage = new BrowserSessionStorage({ storage: sessionStorage });

// Primero hago el logout por que lo necesita cuando el backend responde 401
export const logoutUseCase = new LogoutUseCase({ authSessionStorage, authStore });

// Creo la peticion htpp que pone el token en cada peticion y cierra session si caduca
const httpClient = new HttpClient({
    baseUrl: config.apiUrl,
    getToken: () => authSessionStorage.get()?.accessToken ?? null,
    onUnauthorized: () => void logoutUseCase.execute(),
})

// Conecto el puerto authrepository con el adaptador que habla con el backend
const authRepository = new AuthHTTPRepository({ httpClient });

export const loginUseCase = new LoginUseCase({
    authRepository,
    authSessionStorage,
    authStore,
})

export const registerUseCase = new RegisterUseCase({
    authRepository,
})

export const restoreSessionUseCase = new RestoreSessionUseCase({
    authSessionStorage,
    authStore,
    authRepository,
})