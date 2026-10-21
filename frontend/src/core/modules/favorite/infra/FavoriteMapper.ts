import type { AddFavorite } from "../domain/AddFavorite";
import type { StatusFavoriteRequest } from "../domain/StatusFavoriteRequest";
import type { Favorite } from "../domain/Favorite";
import type { AddFavoriteDTO, FavoriteDTO, StatusFavoriteDTO } from "./FavoriteDTO";

export const FavoriteMapper = {

    // Traduzco como envio los datos del front al backend 
    toAddFavoriteDto: (favorite: AddFavorite): AddFavoriteDTO => ({
        resourceId: favorite.favoriteId,
        resourceType: favorite.favoriteType,
    }),

    toStatusFavoriteDto: (favorite: StatusFavoriteRequest): StatusFavoriteDTO => ({
        resourceIds: favorite.resourceIds.join(','),
        resourceType: favorite.resourceType
    }),

    toFavorite: (dto: FavoriteDTO): Favorite => ({
        id: dto.id,
        userId: dto.userId,
        favoriteId: dto.resourceId,
        favoriteType: dto.resourceType,
    }),
}