// Motivos por los que puede fallar una peticion del archivo
export type ResourceErrorCode =
    | 'NOT_FOUND' // No existe ese registro
    | 'UPSTREAM_UNAVAILABLE' // Swapi esta caida o tarda demasiado
    | 'TOO_MANY_REQUESTS' // Demasiadas peticiones de golpe
    | 'NETWORK' // No llego al servidor
    | 'UNKNOWN'; // Cualquier otro fallo

// Error de cualquier recurso del archivo con su codigo y la frase para el usuario
export class ResourceError extends Error {
    readonly code: ResourceErrorCode;

    constructor(code: ResourceErrorCode, message: string) {
        super(message);
        this.name = 'ResourceError';
        this.code = code;
    }
}