import type { AddFavorite } from "../domain/AddFavorite";
import type { Favorite } from "../domain/Favorite";
import type { AddFavoriteDTO, FavoriteDTO } from "./FavoriteDTO";

export const FavoriteMapper = {

    // Traduzco como envio los datos del front al backend 
    toAddFavoriteDto: (favorite: AddFavorite): AddFavoriteDTO => ({
        resourceId: favorite.favoriteId,
        resourceType: favorite.favoriteType,
    }),

    toFavorite: (dto: FavoriteDTO): Favorite => ({
        id: dto.id,
        userId: dto.userId,
        favoriteId: dto.resourceId,
        favoriteType: dto.resourceType,
    }),
}