import type { Favorite } from "./Favorite"
import type { AddFavorite } from "./AddFavorite"
import type { StatusFavoriteRequest } from "./StatusFavoriteRequest";
import type { DeleteFavoriteRequest } from "./DeleteFavorite";
import type { PageRequest, Paginated } from "../../common";

export interface FavoriteRepository {
    addFavorite(favorite: AddFavorite): Promise<Favorite>;
    getStatusFavorite(request: StatusFavoriteRequest): Promise<Favorite[]>;
    deleteFavorite(favoriteId: DeleteFavoriteRequest): Promise<Favorite>;
    getFavorites(request: PageRequest): Promise<Paginated<Favorite>>;
}