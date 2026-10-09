import { ResourceError, type ResourceErrorCode } from "@/core/modules/common";

const MAX_RETRIES = 1;

// Si no existe o nos han frenado reintentar no arregla nada
const NO_RETRY_CODES: ResourceErrorCode[] = ["NOT_FOUND", "TOO_MANY_REQUESTS"];

// Miro si volver a pedirlo puede dar otro resultado
export const isRetryable = (error: Error) =>
    !(error instanceof ResourceError && NO_RETRY_CODES.includes(error.code));

// Reintento una vez salvo cuando volver a pedirlo daria el mismo error
export const retryResource = (failureCount: number, error: Error) =>
    isRetryable(error) && failureCount < MAX_RETRIES;
