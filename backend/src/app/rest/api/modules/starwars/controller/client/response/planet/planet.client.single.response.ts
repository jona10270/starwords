import { ApiProperty } from "@nestjs/swagger";
import { PlanetVM } from "../../../../model/planet/planet.view-model";
import { PlanetSingleDto } from "@app/modules/starwars/planet/dto/planet.single.dto";

export class PlanetSingleResponse {
    @ApiProperty({
        type: PlanetVM
    })

    public readonly planet: PlanetVM

    public constructor(planet: PlanetSingleDto) {
        this.planet = new PlanetVM(planet)
    }
}