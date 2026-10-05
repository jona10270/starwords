// Los motivos de fallo de auth que la app sabe distinguir
export type AuthErrorCode =
    | 'INVALID_CREDENTIALS'
    | 'EMAIL_TAKEN'
    | 'TOO_MANY_REQUESTS'
    | 'SESSION_INVALID'
    | 'NETWORK'
    | 'UNKNOWN';

// Error de negocio con un codigo estable y la frase que ve el usuario
export class AuthError extends Error {
    readonly code: AuthErrorCode;

    constructor(code: AuthErrorCode, message: string) {
        super(message);
        this.name = 'AuthError';
        this.code = code;
    }
}