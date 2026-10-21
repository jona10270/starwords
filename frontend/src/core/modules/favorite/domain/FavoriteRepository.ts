import type { Favorite } from "./Favorite"
import type { AddFavorite } from "./AddFavorite"

export interface FavoriteRepository {
    addFavorite(favorite: AddFavorite): Promise<Favorite>
}