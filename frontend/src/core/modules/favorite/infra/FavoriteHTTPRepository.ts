import type { HttpClient } from "../../common";
import type { AddFavorite } from "../domain/AddFavorite";
import type { Favorite } from "../domain/Favorite";
import type { FavoriteRepository } from "../domain/FavoriteRepository";
import type { FavoriteResponseDTO } from "./FavoriteDTO";
import { FavoriteErrorMapper } from "./FavoriteErrorMapper";
import { FavoriteMapper } from "./FavoriteMapper";

interface FavoriteHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class FavoriteHTTPRepository implements FavoriteRepository {
    private readonly httpClient: HttpClient;

    constructor({ httpClient }: FavoriteHTTPRepositoryProps) {
        this.httpClient = httpClient;
    }

    async addFavorite(favorite: AddFavorite): Promise<Favorite> {
        let data: FavoriteResponseDTO;
        try {
            data = await this.httpClient.post<FavoriteResponseDTO>(
                '/favorites', FavoriteMapper.toAddFavoriteDto(favorite)
            );
        } catch (error) {
            throw FavoriteErrorMapper.toAddError(error);
        }
        return FavoriteMapper.toFavorite(data.favorite);
    }
}