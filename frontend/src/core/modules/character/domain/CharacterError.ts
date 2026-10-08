export type CharacterErrorCode = 
 | 'NOT_FOUND' // No existe ese personaje
 | 'UPSTREAM_UNAVAILABLE' // Que va muy lento o sea caido swapi
 | 'TOO_MANY_REQUESTS' // Muchas peticiones de golpe
 | 'NETWORK' // Fallo de red
 | 'UNKNOWN' // Desconocido

 // Como queiro que se vean los errores de los personajes de mi swapi
export class CharacterError extends Error {
    readonly code: CharacterErrorCode;

    constructor(code: CharacterErrorCode, message: string) {
        super(message);
        this.name = 'CharacterError';
        this.code = code;
    }
}