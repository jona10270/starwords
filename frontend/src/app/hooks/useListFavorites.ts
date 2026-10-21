import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getFavoritesUseCase } from "@/core/di/container";
import type { PageRequest } from "@/core/modules/common";

import { useAuthState } from "./useAuthState";

// Pido una pagina de mis favoritos solo si hay sesion
export const useListFavorites = ({ page, limit }: PageRequest) => {
    const authState = useAuthState();
    const userId = authState.kind === "AuthenticatedAuthState" ? authState.user.id : null;

    return useQuery({
        // Meto el usuario en la clave para que otro usuario no vea la lista del anterior
        queryKey: ["favorites", "list", userId, { page, limit }],
        queryFn: () => getFavoritesUseCase.execute({ page, limit }),
        enabled: userId !== null,
        placeholderData: keepPreviousData,
        retry: 1,
    });
};
