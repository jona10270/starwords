import { HttpError } from "../../common";

import { FavoriteError } from "../domain/FavoriteError";

// Traduzco los errores que son iguales en todas las peticiones de favoritos
const toCommonError = (error: HttpError): FavoriteError => {
    if (error.status === null) {
        return new FavoriteError('NETWORK', 'No se puede conectar al servidor');
    }

    if (error.status === 401) {
        return new FavoriteError('SESSION_INVALID', 'Inicia sesión para guardar tus favoritos');
    }

    if (error.status === 502 || error.status === 504) {
        return new FavoriteError('UPSTREAM_UNAVAILABLE', 'El archivo galáctico no responde, inténtalo en un momento');
    }

    if (error.status === 429) {
        return new FavoriteError('TOO_MANY_REQUESTS', 'Demasiados intentos, espera unos minutos');
    }

    return new FavoriteError('UNKNOWN', 'Algo salió mal, inténtalo de nuevo');
};

const toUnexpectedError = (error: unknown): Error =>
    error instanceof Error ? error : new Error(String(error));

export const FavoriteErrorMapper = {
    // Al guardar un 404 es que el registro no existe y un 409 que ya lo tengo
    toAddError: (error: unknown): Error => {
        if (!(error instanceof HttpError)) return toUnexpectedError(error);

        if (error.status === 404) {
            return new FavoriteError('NOT_FOUND', 'Ese registro no existe');
        }

        if (error.status === 409) {
            return new FavoriteError('ALREADY_FAVORITE', 'Ya lo tienes en favoritos');
        }

        return toCommonError(error);
    },
};
