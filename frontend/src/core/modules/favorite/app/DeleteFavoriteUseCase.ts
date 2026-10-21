import type { UseCase } from "@/core/lib";

import type { FavoriteRepository } from "../domain/FavoriteRepository";
import type { Favorite } from "../domain/Favorite";
import type { DeleteFavoriteRequest } from "../domain/DeleteFavorite";

interface DeleteFavoriteUseCaseProps {
    favoriteRepository: FavoriteRepository;
}

export class DeleteFavoriteUseCase implements UseCase<DeleteFavoriteRequest, Favorite> {
    private readonly favoriteRepository: FavoriteRepository;

    constructor({ favoriteRepository }: DeleteFavoriteUseCaseProps) {
        this.favoriteRepository = favoriteRepository;
    };

    async execute(favoriteId: DeleteFavoriteRequest): Promise<Favorite> {
        return await this.favoriteRepository.deleteFavorite(favoriteId);
    };
}