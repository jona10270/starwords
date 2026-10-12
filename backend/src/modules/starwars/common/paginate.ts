// Resultado de cortar una lista en memoria
export interface PaginatedItems<T> {
  items: T[];
  total: number;
}

// Corto la pagina pedida de una lista que ya tengo entera
export const paginate = <T>(
  items: T[],
  page: number,
  limit: number,
): PaginatedItems<T> => {
  const start = (page - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    total: items.length,
  };
};
