import type { AddFavorite } from "../domain/AddFavorite";
import type { StatusFavoriteRequest } from "../domain/StatusFavoriteRequest";
import type { DeleteFavoriteRequest } from "../domain/DeleteFavorite";
import type { Favorite } from "../domain/Favorite";
import type { FavoriteWithName } from "../domain/FavoriteWithName";
import type { AddFavoriteDTO, FavoriteDTO, StatusFavoriteDTO, DeleteFavoriteDTO, FavoriteWithNameDTO } from "./FavoriteDTO";

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

    toDeleteFavoriteDto: (deleteFavorite: DeleteFavoriteRequest): DeleteFavoriteDTO => ({
        favoriteId: deleteFavorite.favoriteId
    }),

    toFavorite: (dto: FavoriteDTO): Favorite => ({
        id: dto.id,
        userId: dto.userId,
        favoriteId: dto.resourceId,
        favoriteType: dto.resourceType,
        createdAt: dto.createdAt,
    }),

    // Igual que toFavorite pero con el nombre que me da el listado
    toFavoriteWithName: (dto: FavoriteWithNameDTO): FavoriteWithName => ({
        ...FavoriteMapper.toFavorite(dto),
        name: dto.name,
    }),
}