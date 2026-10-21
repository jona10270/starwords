import { deleteFavoriteUseCase } from "@/core/di/container";
import type { DeleteFavoriteRequest } from "@/core/modules/favorite";
import { useMutation } from "@tanstack/react-query";

// Quito un favorito por su uuid y react query me dice si esta cargando si ha fallado o si ha ido bien
export const useDeleteFavorite = () => {
    return useMutation({
        mutationFn: (request: DeleteFavoriteRequest) =>
            deleteFavoriteUseCase.execute(request)
    })
}
