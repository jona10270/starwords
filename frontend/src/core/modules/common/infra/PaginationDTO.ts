import type { Paginated } from "../domain/Pagination";

// Como me llega el meta de paginacion del backend
export interface PaginationMetaDTO {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

// Junto los items ya mapeados con el meta para el dominio
export const PaginationMapper = {
    toPaginated: <T>(items: T[], meta: PaginationMetaDTO): Paginated<T> => ({
        items,
        total: meta.total,
        page: meta.page,
        limit: meta.limit,
        totalPages: meta.totalPage,
    }),
};