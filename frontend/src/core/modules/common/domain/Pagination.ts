// Lo que envio al backend para el paginado
export interface PageRequest {
    page: number;
    limit: number;
}

// Una pagina de resultados con lo necesario para pintar el paginador
export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}