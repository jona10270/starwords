import type { HttpClient } from "../../common";
import type { AddFavorite } from "../domain/AddFavorite";
import type { DeleteFavoriteRequest } from "../domain/DeleteFavorite";
import type { Favorite } from "../domain/Favorite";
import type { FavoriteRepository } from "../domain/FavoriteRepository";
import type { StatusFavoriteRequest } from "../domain/StatusFavoriteRequest";
import type { FavoriteResponseDTO, FavoriteStatusResponseDTO } from "./FavoriteDTO";
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

    public async getStatusFavorite(request: StatusFavoriteRequest): Promise<Favorite[]> {
        let data: FavoriteStatusResponseDTO;
        try {
            data = await this.httpClient.get<FavoriteStatusResponseDTO>(
                `/favorites/status`, FavoriteMapper.toStatusFavoriteDto(request)
            )
        } catch (error) {
            throw FavoriteErrorMapper.toStatusError(error);
        }
        return data.favorite.map(FavoriteMapper.toFavorite)
    }

    public async deleteFavorite(favoriteId: DeleteFavoriteRequest): Promise<Favorite> {
        let data: FavoriteResponseDTO;
        try {
            data = await this.httpClient.delete<FavoriteResponseDTO>(
                `/favorites/${favoriteId.favoriteId}`
            )
        } catch (error) {
            throw FavoriteErrorMapper.toStatusError(error);
        }

        return FavoriteMapper.toFavorite(data.favorite);
    }
}