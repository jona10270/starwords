export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidUuid = (id: string): boolean => UUID_REGEX.test(id);
