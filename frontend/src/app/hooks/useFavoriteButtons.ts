import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { FavoriteError } from "@/core/modules/favorite";
import type { FavoriteButtonProps } from "@/ui/atoms";

import { buildLoginPath } from "../navigation/safeRedirect";
import { useAddFavorite } from "./useAddFavorite";
import { useAuthState } from "./useAuthState";
import { useFavoritesStatus } from "./useFavoritesStatus";

// Preparo los corazones de una pagina con lo que dice el backend y los que acabo de marcar
export const useFavoriteButtons = (favoriteType: string, favoriteIds: string[]) => {
    const authState = useAuthState();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const addFavorite = useAddFavorite();
    const status = useFavoritesStatus(favoriteType, favoriteIds);
    const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(new Set());

    const isAuthenticated = authState.kind === "AuthenticatedAuthState";
    const serverIds = new Set(status.data?.map((favorite) => favorite.favoriteId));

    // Es favorito si lo dice el backend o si lo acabo de marcar y aun no ha contestado
    const isFavorite = (favoriteId: string) =>
        isAuthenticated && (serverIds.has(favoriteId) || savedIds.has(favoriteId));

    const markAsSaved = (favoriteId: string) =>
        setSavedIds((current) => new Set(current).add(favoriteId));

    const unmarkAsSaved = (favoriteId: string) =>
        setSavedIds((current) => {
            const next = new Set(current);
            next.delete(favoriteId);
            return next;
        });

    // Vuelvo a pedir el estado para que el rojo salga ya de la base de datos
    const refreshStatus = () => queryClient.invalidateQueries({ queryKey: ["favorites"] });

    const save = (favoriteId: string) => {
        // Sin sesion le mando al login y luego vuelve a esta pagina
        if (!isAuthenticated) {
            navigate(buildLoginPath(location));
            return;
        }

        // Quitar de favoritos llegara con el delete
        if (isFavorite(favoriteId)) return;

        // Lo pinto en rojo al momento y si el backend falla lo vuelvo a quitar
        markAsSaved(favoriteId);

        addFavorite.mutate(
            { favoriteId, favoriteType },
            {
                onSuccess: refreshStatus,
                // Si el backend dice que ya lo tengo lo dejo en rojo porque es verdad
                onError: (error) => {
                    if (error instanceof FavoriteError && error.code === "ALREADY_FAVORITE") {
                        void refreshStatus();
                        return;
                    }
                    unmarkAsSaved(favoriteId);
                },
            },
        );
    };

    const getFavoriteButton = (favoriteId: string): FavoriteButtonProps => ({
        isFavorite: isFavorite(favoriteId),
        onClick: () => save(favoriteId),
    });

    // El aviso de ya lo tengo no es un fallo para el usuario
    const isAlreadyFavorite = addFavorite.error instanceof FavoriteError && addFavorite.error.code === "ALREADY_FAVORITE";
    const errorMessage = addFavorite.error && !isAlreadyFavorite ? addFavorite.error.message : null;

    return { getFavoriteButton, errorMessage };
};
