import type { Favorite } from "./Favorite";

// Favorito de mi listado con el nombre del registro y null si el backend no lo encuentra
export interface FavoriteWithName extends Favorite {
    name: string | null;
}
