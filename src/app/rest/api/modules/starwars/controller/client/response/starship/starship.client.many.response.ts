import { ApiProperty } from "@nestjs/swagger";
import { StarshipVM } from "../../../../model/starship/starship.view-model";
import { StarshipAllDto } from "@app/modules/starwars/starships/dto/starship.all.dto";

export class StarshipManyResponse {
    @ApiProperty({
        type: [StarshipVM]
    })
    public readonly starship: StarshipVM[]

    public constructor(data: StarshipAllDto[]) {
        this.starship = data.map(starship => new StarshipVM(starship))
    }

}