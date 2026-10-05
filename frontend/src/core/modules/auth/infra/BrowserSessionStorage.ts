import { z } from "zod";

import type { AuthSessionStorage } from "../domain/AuthSessionStorage";
import type { AuthSession } from "../domain/AuthSession";

// Nomobre de la clave donde guardo la session en el navegador
const STORAGE_KEY = "star-words-session";

// La forma exacta que tiene que tener lo guardado para considerarlo una sesion
const authSessionSchema = z.object({
    accessToken: z.string().min(1),
    expiresAt: z.number(),
});

// Convierto el texto guardado en sesion y si no es json o no tiene la forma devuelvo null
const parseSession = (saved: string): AuthSession | null => {
    try {
        const result = authSessionSchema.safeParse(JSON.parse(saved));
        return result.success ? result.data : null;
    } catch {
        return null;
    }
};

interface BrowserSessionStorageProps {
    storage: Storage;
}

export class BrowserSessionStorage implements AuthSessionStorage {
    private readonly storage: Storage;

    constructor({ storage }: BrowserSessionStorageProps) {
        this.storage = storage;
    }

    // Guardo la session convertido a texto
    save(session: AuthSession): void {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(session));
    }

    // Miro la session guardada y si esta corrupta o no tiene la forma correcta se borra
    get(): AuthSession | null {
        const saved = this.storage.getItem(STORAGE_KEY);

        // Si esta vacio no se guarda niguna session
        if (!saved) {
            return null;
        }

        const session = parseSession(saved);

        // Si lo guardado no vale lo borro para que no se quede ahi para siempre
        if (!session) {
            this.clear();
        }

        return session;
    }

    // Para eliminar la session del navegador
    clear(): void {
        this.storage.removeItem(STORAGE_KEY);
    }
}