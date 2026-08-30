import { ApiProperty } from "@nestjs/swagger";
import { StarshipVM } from "../../../../model/starship/starship.view-model";
import { StarshipAllDto } from "@app/modules/starwars/starships/dto/starship.all.dto";

export class StarshipSingleResponse{
    @ApiProperty({
        type: StarshipVM
    })

    public readonly starShip: StarshipVM

    public constructor(data: StarshipAllDto) {
        this.starShip = new StarshipVM(data)
    }
}