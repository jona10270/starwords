import { ApiProperty } from "@nestjs/swagger";

import { FilmVM } from "../../../../model/film/film.view-model";
import { FilmSingleDto } from "@app/modules/starwars/film/dto/film.single.dto";

export class FilmSingleResponse {
    @ApiProperty({
        type: FilmVM
    })
    public readonly film: FilmVM;

    public constructor(data: FilmSingleDto){
        this.film = new FilmVM(data)
    }
}