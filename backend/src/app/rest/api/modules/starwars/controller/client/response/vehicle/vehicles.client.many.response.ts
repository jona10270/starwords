import { ApiProperty } from "@nestjs/swagger";
import { VehicleVM } from "../../../../model/vehicle/vehicles.view-model";
import { VehicleAllDto } from "@app/modules/starwars/vehicles/dto/vehicles.all.dto";

export class VehiclesManyResponse {
    @ApiProperty({
        type: [VehicleVM],
    })

    public readonly vehicles: VehicleVM[]

    public constructor(data: VehicleAllDto[]){
        this.vehicles = data.map(vehicle => new VehicleVM(vehicle))
    }

}