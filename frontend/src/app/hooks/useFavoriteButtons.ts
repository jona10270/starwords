import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FavoriteError } from "@/core/modules/favorite";
import type { FavoriteButtonProps } from "@/ui/atoms";

import { buildLoginPath } from "../navigation/safeRedirect";
import { useAddFavorite } from "./useAddFavorite";
import { useAuthState } from "./useAuthState";

// Preparo los corazones de una pagina y guardo en memoria los que ya marque
export const useFavoriteButtons = (favoriteType: string) => {
    const authState = useAuthState();
    const navigate = useNavigate();
    const location = useLocation();
    const addFavorite = useAddFavorite();
    const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(new Set());

    const markAsSaved = (favoriteId: string) =>
        setSavedIds((current) => new Set(current).add(favoriteId));

    const save = (favoriteId: string) => {
        // Sin sesion le mando al login y luego vuelve a esta pagina
        if (authState.kind !== "AuthenticatedAuthState") {
            navigate(buildLoginPath(location));
            return;
        }

        // Quitar de favoritos llegara con el delete
        if (savedIds.has(favoriteId)) return;

        addFavorite.mutate(
            { favoriteId, favoriteType },
            {
                onSuccess: () => markAsSaved(favoriteId),
                // Si el backend dice que ya lo tengo lo pinto en rojo porque es verdad
                onError: (error) => {
                    if (error instanceof FavoriteError && error.code === "ALREADY_FAVORITE") markAsSaved(favoriteId);
                },
            },
        );
    };

    const getFavoriteButton = (favoriteId: string): FavoriteButtonProps => ({
        isFavorite: savedIds.has(favoriteId),
        isSaving: addFavorite.isPending && addFavorite.variables.favoriteId === favoriteId,
        onClick: () => save(favoriteId),
    });

    // El aviso de ya lo tengo no es un fallo para el usuario
    const isAlreadyFavorite = addFavorite.error instanceof FavoriteError && addFavorite.error.code === "ALREADY_FAVORITE";
    const errorMessage = addFavorite.error && !isAlreadyFavorite ? addFavorite.error.message : null;

    return { getFavoriteButton, errorMessage };
};
