import type { UseCase } from "@/core/lib";

import type { FavoriteRepository } from "../domain/FavoriteRepository";
import type { Favorite } from "../domain/Favorite";
import type { StatusFavoriteRequest } from "../domain/StatusFavoriteRequest";

interface StatusFavoriteUseCaseProps {
    favoriteRepository: FavoriteRepository;
}

export class StatusFavoriteUseCase implements UseCase<StatusFavoriteRequest, Favorite[]> {
    private readonly favoriteRepository: FavoriteRepository;

    constructor({ favoriteRepository }: StatusFavoriteUseCaseProps) {
        this.favoriteRepository = favoriteRepository;
    };

    async execute(addFavorite: StatusFavoriteRequest): Promise<Favorite[]> {
        return await this.favoriteRepository.getStatusFavorite(addFavorite);
    };
}