import { ApiProperty } from "@nestjs/swagger";
import { SpecieVM } from "../../../../model/specie/specie.view-model";
import { SpeciesAllDto } from "@app/modules/starwars/specie/dto/specie.all.dto";

export class SpecieManyResponse {
    @ApiProperty({
        type: [SpecieVM]
    })

    public readonly specie: SpecieVM[]

    public constructor(data: SpeciesAllDto[]) {
        this.specie = data.map(specie => new SpecieVM(specie))
    }
}