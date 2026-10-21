// Lo que necesito para crear un favorito
export interface AddFavoriteDTO {
    resourceId: string;
    resourceType: string;
};

export type StatusFavoriteDTO = {
    resourceIds: string,
    resourceType: string
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