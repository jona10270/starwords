// Error de red con el estado http null si no hubo respuesta del servidor
export class HttpError extends Error {
    readonly status: number | null;

    constructor(status: number | null, cause?: unknown) {
        super(status === null ? 'Network error' : `HTTP error ${status}`, { cause });
        this.name = 'HttpError';
        this.status = status;
    }
}