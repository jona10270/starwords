import { HttpError } from "./HttpError";
import { ResourceError } from "../domain/ResourceError";

const toCommonError = (error: HttpError): ResourceError => {
    if (error.status === null) {
        return new ResourceError('NETWORK', 'No se puede conectar al servidor');
    }

    if (error.status === 502 || error.status === 504) {
        return new ResourceError('UPSTREAM_UNAVAILABLE', 'El archivo galáctico no responde, inténtalo en un momento');
    }

    if (error.status === 429) {
        return new ResourceError('TOO_MANY_REQUESTS', 'Demasiados intentos, espera unos minutos');
    }

    return new ResourceError('UNKNOWN', 'Algo salió mal, inténtalo de nuevo');
}

const toUnexpectedError = (error: unknown): Error => 
    error instanceof Error ? error : new Error(String(error));

export const ResourceErrorMapper = {

    toListError: (error: unknown): Error => {
        if (!(error instanceof HttpError)) return toUnexpectedError(error);
        return toCommonError(error);
    },

    // Error al pedir un registro concreto
    toDetailError: (error: unknown, notFoundMessage: string): Error => {
        if (!(error instanceof HttpError)) return toUnexpectedError(error);

        if (error.status === 404)  {
            return new ResourceError('NOT_FOUND', notFoundMessage);
        }

        return toCommonError(error)
    }
}