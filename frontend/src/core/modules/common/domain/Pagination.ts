// Lo que envio al backend para el paginado
export interface PageRequest {
    page: number;
    limit: number;
}

// Lo que envio al backend para pedir una pagina filtrada por texto
export interface SearchPageRequest extends PageRequest {
    search?: string;
}

// Una pagina de resultados con lo necesario para pintar el paginador
export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}