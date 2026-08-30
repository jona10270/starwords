import { ApiProperty } from "@nestjs/swagger";
import { PlanetVM } from "../../../../model/planet/planet.view-model";
import { PlanetAllDto } from "@app/modules/starwars/planet/dto/planet.all.dto";

export class PlanerManyResponse {
    @ApiProperty({
        type: [PlanetVM]
    })

    public readonly planets: PlanetVM[]

    public constructor(data: PlanetAllDto[]) {
        this.planets = data.map(planet => new PlanetVM(planet))
    }
}