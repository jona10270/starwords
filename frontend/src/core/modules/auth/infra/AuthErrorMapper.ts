import { HttpError } from "../../common";

import { AuthError } from "../domain/AuthError";

// Traduzco los errores que son iguales en login y register
const toCommonError = (error: HttpError): AuthError => {
    if (error.status === null) {
        return new AuthError('NETWORK', 'No se puede conectar con el servidor');
    }

    if (error.status === 429) {
        return new AuthError('TOO_MANY_REQUESTS', 'Demasiados intentos, espera un minuto');
    }
    return new AuthError('UNKNOWN', 'Algo salio mal intentalo de nuevo')
};

const toUnexpectedError = (error: unknown): Error => 
    error instanceof Error ? error : new Error(String(error));

export const AuthErrorMapper = {
    // Error 401 significa en el login credenciales malas
    toLoginError: (error: unknown): Error => {
        if(!(error instanceof HttpError)) return toUnexpectedError(error);

        if (error.status === 401) {
            return new AuthError('INVALID_CREDENTIALS', 'Email o contraseña incorrectos');
        }
        return toCommonError(error)
    },

    // Un 409 o 422 esos registros significan email repetido
    toRegisterError: (error: unknown): Error => {
        if(!(error instanceof HttpError)) return toUnexpectedError(error)
    
        if (error.status === 409 || error.status === 422) {
            return new AuthError('EMAIL_TAKEN', 'Ese email ya esta registrado');
        }
        return toCommonError(error);
    }
}

