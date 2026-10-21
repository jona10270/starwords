// Los motivos de fallo de favoritos que la app sabe distinguir
export type FavoriteErrorCode =
    | 'SESSION_INVALID' // No tengo sesion o ha caducado
    | 'NOT_FOUND' // El registro de swapi no existe
    | 'ALREADY_FAVORITE' // Ya lo tengo guardado
    | 'UPSTREAM_UNAVAILABLE' // Swapi esta caida o tarda demasiado
    | 'TOO_MANY_REQUESTS' // Demasiadas peticiones de golpe
    | 'NETWORK' // No llego al servidor
    | 'UNKNOWN'; // Cualquier otro fallo

// Error de favoritos con su codigo y la frase para el usuario
export class FavoriteError extends Error {
    readonly code: FavoriteErrorCode;

    constructor(code: FavoriteErrorCode, message: string) {
        super(message);
        this.name = 'FavoriteError';
        this.code = code;
    }
}
