import type { AuthSession } from "./AuthSession";

// Creo el puerto de fuera para el almacenamiento de la sesión de autenticación
export interface AuthSessionStorage {
    // Guardo la seesión de autenticación en el almacenamiento
    save(session: AuthSession): void;
    // Compruebo si hay una sesión de autenticación en el almacenamiento
    get(): AuthSession | null;
    // Borro la sesión de autenticación del almacenamiento
    clear(): void;
}