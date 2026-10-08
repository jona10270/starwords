import { QueryFailedError } from 'typeorm';

// Codigo de postgres cuando se rompe un indice unico
const UNIQUE_VIOLATION_CODE = '23505';

// Detecto si la bd rechazo un insert o update por un valor repetido
export const isUniqueViolation = (error: unknown): boolean =>
  error instanceof QueryFailedError &&
  (error.driverError as { code?: string } | undefined)?.code ===
    UNIQUE_VIOLATION_CODE;
