import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { FavoriteError } from "@/core/modules/favorite";
import type { FavoriteButtonProps } from "@/ui/atoms";

import { buildLoginPath } from "../navigation/safeRedirect";
import { useAddFavorite } from "./useAddFavorite";
import { useAuthState } from "./useAuthState";
import { useDeleteFavorite } from "./useDeleteFavorite";
import { useFavoritesStatus } from "./useFavoritesStatus";

// Preparo los corazones de una pagina con lo que dice el backend y los que estoy cambiando
export const useFavoriteButtons = (favoriteType: string, favoriteIds: string[]) => {
    const authState = useAuthState();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const addFavorite = useAddFavorite();
    const deleteFavorite = useDeleteFavorite();
    const status = useFavoritesStatus(favoriteType, favoriteIds);

    // Guardo como quedara cada corazon que he pulsado mientras el backend no confirma
    const [pending, setPending] = useState<ReadonlyMap<string, boolean>>(new Map());

    const isAuthenticated = authState.kind === "AuthenticatedAuthState";

    // Id de swapi con el uuid del favorito que necesito para borrarlo
    const serverFavorites = new Map(status.data?.map((favorite) => [favorite.favoriteId, favorite.id]));

    const isFavorite = (favoriteId: string) =>
        isAuthenticated && (pending.get(favoriteId) ?? serverFavorites.has(favoriteId));

    const setPendingState = (favoriteId: string, willBeFavorite: boolean) =>
        setPending((current) => new Map(current).set(favoriteId, willBeFavorite));

    const clearPendingState = (favoriteId: string) =>
        setPending((current) => {
            const next = new Map(current);
            next.delete(favoriteId);
            return next;
        });

    // Vuelvo a pedir el estado para que el corazon salga ya de la base de datos
    const refreshStatus = () => queryClient.invalidateQueries({ queryKey: ["favorites"] });

    const toggle = async (favoriteId: string) => {
        // Sin sesion le mando al login y luego vuelve a esta pagina
        if (!isAuthenticated) {
            navigate(buildLoginPath(location));
            return;
        }

        // Mientras espero respuesta de este corazon no dejo volver a pulsarlo
        if (pending.has(favoriteId)) return;

        const uuid = serverFavorites.get(favoriteId);

        // Lo cambio al momento y si el backend falla vuelvo a lo que diga el estado
        setPendingState(favoriteId, uuid === undefined);

        try {
            if (uuid) {
                await deleteFavorite.mutateAsync({ favoriteId: uuid });
            } else {
                await addFavorite.mutateAsync({ favoriteId, favoriteType });
            }
        } catch (error) {
            // Si el backend dice que ya lo tengo es verdad que es favorito asi que refresco igual
            const isAlreadyFavorite = error instanceof FavoriteError && error.code === "ALREADY_FAVORITE";
            if (!isAlreadyFavorite) {
                clearPendingState(favoriteId);
                return;
            }
        }

        await refreshStatus();
        clearPendingState(favoriteId);
    };

    const getFavoriteButton = (favoriteId: string): FavoriteButtonProps => ({
        isFavorite: isFavorite(favoriteId),
        onClick: () => void toggle(favoriteId),
    });

    // El aviso de ya lo tengo no es un fallo para el usuario
    const isAlreadyFavorite = addFavorite.error instanceof FavoriteError && addFavorite.error.code === "ALREADY_FAVORITE";
    const addErrorMessage = addFavorite.error && !isAlreadyFavorite ? addFavorite.error.message : null;
    const errorMessage = addErrorMessage ?? deleteFavorite.error?.message ?? null;

    return { getFavoriteButton, errorMessage };
};
