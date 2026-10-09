import type { CharacterRepository } from "../domain/CharacterRepository"
import { HttpClient } from "../../common"
import type { CharacterResponseDTO, CharacterListResponseDTO } from "./CharacterDTO";
import { CharacterMapper } from "./CharacterMapper";
import type { Character } from "../domain/Character";
import { ResourceErrorMapper } from "../../common";

// Lo que necesito para hablar con el backend
interface CharacterHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class CharacterHTTPRepository implements CharacterRepository {
    private readonly httpClient: HttpClient;

    constructor({ httpClient}: CharacterHTTPRepositoryProps) {
        this.httpClient = httpClient;
    }

    async getAll(): Promise<Character[]> {
        let data: CharacterListResponseDTO
        try{
            data = await this.httpClient.get<CharacterListResponseDTO>(
            '/starwars/people'
        )
        } catch (error) {
            throw ResourceErrorMapper.toListError(error)
        }

        return data.people.map((CharacterMapper.toCharacter));
    }

    async getCharacter(id: string): Promise<Character> {
        let data: CharacterResponseDTO;
        try {
            data = await this.httpClient.get<CharacterResponseDTO>(`/starwars/people/${id}`)
        } catch (error) {
            throw ResourceErrorMapper.toDetailError(error, 'El personaje no existe')
        }
        return CharacterMapper.toCharacter(data.people)
    }

}