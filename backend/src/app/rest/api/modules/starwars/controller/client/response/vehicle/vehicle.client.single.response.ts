import { ApiProperty } from '@nestjs/swagger';
import { VehicleVM } from '../../../../model/vehicle/vehicles.view-model';
import { VehicleWithIdDto } from '@app/modules/starwars/vehicles/dto/vehicles.all.dto';

export class VehicleSingleResponse {
  @ApiProperty({
    type: VehicleVM,
  })
  public readonly vehicle: VehicleVM;

  public constructor(data: VehicleWithIdDto) {
    this.vehicle = new VehicleVM(data);
  }
}
