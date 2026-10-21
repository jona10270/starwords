import type { UseCase } from "@/core/lib";

import type { FavoriteRepository } from "../domain/FavoriteRepository";
import type { FavoriteWithName } from "../domain/FavoriteWithName";
import type { PageRequest, Paginated } from "../../common";

interface GetFavoritesUseCaseProps {
    favoriteRepository: FavoriteRepository;
}

export class GetFavoritesUseCase implements UseCase<PageRequest, Paginated<FavoriteWithName>> {
    private readonly favoriteRepository: FavoriteRepository;

    constructor({ favoriteRepository }: GetFavoritesUseCaseProps) {
        this.favoriteRepository = favoriteRepository;
    }

    async execute({ page, limit }: PageRequest): Promise<Paginated<FavoriteWithName>> {
        return this.favoriteRepository.getFavorites({ page, limit });
    }
}
