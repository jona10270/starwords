// Esto es donde la app vive mientras la app esta abierta
import { createStore, type StoreApi } from "zustand/vanilla";

import type { AuthSession } from "../domain/AuthSession";
import type { AuthUser } from "../domain/AuthUser";

// Los tres estados posibles de la app
export type AuthState = 
    | { kind: 'CheckingAuthState'}
    | { kind: 'AuthenticatedAuthState'; session: AuthSession; user: AuthUser}
    | { kind: 'UnauthenticatedAuthState'}

// Lo que guarda el store y las acciones que los cambia
interface AuthStoreState {
    auth: AuthState;
    setSession: (session: AuthSession, user: AuthUser) => void;
    clearSession: () => void;
}

export type AuthStore = StoreApi<AuthStoreState>

export const createAuthStore = (): AuthStore =>
    createStore<AuthStoreState>()((set) => ({
        auth: { kind: 'CheckingAuthState' },
        setSession: (session, user) =>
            set({auth: { kind: 'AuthenticatedAuthState', session, user } }),
        clearSession: () => set({auth: {kind: 'UnauthenticatedAuthState'}})
    }));

