import { useQuery } from "@tanstack/react-query";

import { statusFavoriteUseCase } from "@/core/di/container";

import { useAuthState } from "./useAuthState";

// Pregunto al backend cuales de estos ids tengo en favoritos solo si hay sesion
export const useFavoritesStatus = (resourceType: string, resourceIds: string[]) => {
    const authState = useAuthState();
    const userId = authState.kind === "AuthenticatedAuthState" ? authState.user.id : null;

    return useQuery({
        // Meto el usuario en la clave para que otro usuario no vea los favoritos del anterior
        queryKey: ["favorites", "status", userId, resourceType, resourceIds],
        queryFn: () => statusFavoriteUseCase.execute({ resourceType, resourceIds }),
        enabled: userId !== null && resourceIds.length > 0,
        retry: 1,
    });
};
