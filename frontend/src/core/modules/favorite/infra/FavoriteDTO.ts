import type { PaginationMetaDTO } from "../../common";

// Lo que necesito para crear un favorito
export interface AddFavoriteDTO {
    resourceId: string;
    resourceType: string;
};

export type StatusFavoriteDTO = {
    resourceIds: string,
    resourceType: string
};

export type DeleteFavoriteDTO = {
    favoriteId: string;
};

export interface FavoriteDTO {
    id: string;
    userId: string;
    resourceId: string;
    resourceType: string;
    createdAt: string;
};

export interface FavoriteResponseDTO {
    favorite: FavoriteDTO,
};

export interface FavoriteStatusResponseDTO {
    favorite: FavoriteDTO[],
};

// Una pagina de mis favoritos con su meta de paginacion
export interface FavoriteListResponseDTO {
    favorites: FavoriteDTO[];
    meta: PaginationMetaDTO;
};