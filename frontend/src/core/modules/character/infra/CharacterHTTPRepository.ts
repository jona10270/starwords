import type { CharacterRepository } from "../domain/CharacterRepository";
import { HttpClient, PaginationMapper, ResourceErrorMapper, type SearchPageRequest, type Paginated } from "../../common";
import type { CharacterResponseDTO, CharacterListResponseDTO } from "./CharacterDTO";
import { CharacterMapper } from "./CharacterMapper";
import type { Character } from "../domain/Character";

// Lo que necesito para hablar con el backend
interface CharacterHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class CharacterHTTPRepository implements CharacterRepository {
    private readonly httpClient: HttpClient;

    constructor({ httpClient }: CharacterHTTPRepositoryProps) {
        this.httpClient = httpClient;
    }

    async getAll({ page, limit, search }: SearchPageRequest): Promise<Paginated<Character>> {
        let data: CharacterListResponseDTO;
        try {
            data = await this.httpClient.get<CharacterListResponseDTO>('/starwars/people', { page, limit, search });
        } catch (error) {
            throw ResourceErrorMapper.toListError(error);
        }

        const characters = data.people.map(CharacterMapper.toCharacter);
        return PaginationMapper.toPaginated(characters, data.meta);
    }

    async getCharacter(id: string): Promise<Character> {
        let data: CharacterResponseDTO;
        try {
            data = await this.httpClient.get<CharacterResponseDTO>(`/starwars/people/${id}`);
        } catch (error) {
            throw ResourceErrorMapper.toDetailError(error, 'El personaje no existe');
        }
        return CharacterMapper.toCharacter(data.people);
    }

}