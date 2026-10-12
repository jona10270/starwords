import { ApiProperty } from '@nestjs/swagger';
import { VehicleVM } from '../../../../model/vehicle/vehicles.view-model';
import { VehicleWithIdDto } from '@app/modules/starwars/vehicles/dto/vehicles.all.dto';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';

export class VehiclesManyResponse {
  @ApiProperty({
    type: [VehicleVM],
  })
  public readonly vehicles: VehicleVM[];

  @ApiProperty({
    type: PaginationMetaVM,
  })
  public readonly meta: PaginationMetaVM;

  public constructor(
    data: VehicleWithIdDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.vehicles = data.map((vehicle) => new VehicleVM(vehicle));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
