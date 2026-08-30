import { ApiProperty } from "@nestjs/swagger";
import { SpecieVM } from "../../../../model/specie/specie.view-model";
import { SpeciesSingleDto } from "@app/modules/starwars/specie/dto/specie.single.dto";

export class SpecieSingleResponse {
    @ApiProperty({
        type: SpecieVM
    })

    public readonly specie: SpecieVM

    public constructor(data: SpeciesSingleDto) {
        this.specie = new SpecieVM(data)
    }
}