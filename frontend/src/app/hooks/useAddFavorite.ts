import { addFavoriteUseCase } from "@/core/di/container";
import type { AddFavorite } from "@/core/modules/favorite";
import { useMutation } from "@tanstack/react-query";

export const useAddFavorite = () => {
    return useMutation({
        mutationFn: (data: AddFavorite) => 
            addFavoriteUseCase.execute(data)
    })
}