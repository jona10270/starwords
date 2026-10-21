import type { Favorite } from "./Favorite"
import type { AddFavorite } from "./AddFavorite"
import type { StatusFavoriteRequest } from "./StatusFavoriteRequest";

export interface FavoriteRepository {
    addFavorite(favorite: AddFavorite): Promise<Favorite>;
    getStatusFavorite(request: StatusFavoriteRequest): Promise<Favorite[]>;
}