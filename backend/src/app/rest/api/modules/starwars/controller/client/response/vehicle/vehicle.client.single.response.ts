import { ApiProperty } from "@nestjs/swagger";
import { VehicleVM } from "../../../../model/vehicle/vehicles.view-model";
import { VehicleAllDto } from "@app/modules/starwars/vehicles/dto/vehicles.all.dto";

export class VehicleSingleResponse {
    @ApiProperty({
        type: VehicleVM
    })

    public readonly vehicle: VehicleVM

    public constructor(data: VehicleAllDto) {
        this.vehicle = new VehicleVM(data)
    }
}