import { Injectable } from "@nestjs/common";

// General request for all calls to the SWAPI API.
@Injectable()
export class SwapiRequest {
    private readonly BASE_URL='https://swapi.info/api';

   public async request<T>(endpoint: string): Promise<T>{
        const response= await fetch( this.BASE_URL + endpoint)

        if(!response.ok){
            throw new Error(`ERROR PETICION: ${response.status}`)
        }

        const data = response.json()

        return data as T
    }

}