import type { UseCase } from "@/core/lib";

import type { FavoriteRepository } from "../domain/FavoriteRepository";
import type { AddFavorite } from "../domain/AddFavorite";
import type { Favorite } from "../domain/Favorite";

interface AddFavoriteUseCaseProps {
    favoriteRepository: FavoriteRepository;
}

export class AddFavoriteUseCase implements UseCase<AddFavorite, Favorite> {
    private readonly favoriteRepository: FavoriteRepository;

    constructor({ favoriteRepository }: AddFavoriteUseCaseProps) {
        this.favoriteRepository = favoriteRepository;
    };

    async execute(addFavorite: AddFavorite): Promise<Favorite> {
        return await this.favoriteRepository.addFavorite(addFavorite);
    };
}