import { HttpError } from "../../common";
import { CharacterError } from "../domain/CharacterError";

const toCommondError = (error: HttpError): CharacterError => {
    if (error.status === null) {
        return new CharacterError('NETWORK', 'No se puede conectar al servidor');
    }

    if (error.status === 502 || error.status === 504) {
        return new CharacterError('UPSTREAM_UNAVAILABLE', 'El archivo galáctico no responde, inténtalo en un momento');
    }

    if (error.status === 429) {
        return new CharacterError('TOO_MANY_REQUESTS', 'Demsiados intentos espera unos minutos');
    }

    return new CharacterError('UNKNOWN', 'Algo salio mal intentalo de nuevo');
}

const toUnexpectedError = (error: unknown): Error => 
    error instanceof Error ? error : new Error(String(error));

export const CharacterErrorMapper = {

    toListError: (error: unknown): Error => {
        if (!(error instanceof HttpError)) return toUnexpectedError(error);
        return toCommondError(error);
    },

    toDetailError: (error: unknown): Error => {
        if (!(error instanceof HttpError)) return toUnexpectedError(error);

        if (error.status === 404)  {
            return new CharacterError('NOT_FOUND', 'El personaje no existe');
        }

        return toCommondError(error)
    }
}