import { ApiProperty } from '@nestjs/swagger';
import { StarshipVM } from '../../../../model/starship/starship.view-model';
import { StarshipDetailDto } from '@app/modules/starwars/starships/dto/starship.all.dto';

export class StarshipSingleResponse {
  @ApiProperty({
    type: StarshipVM,
  })
  public readonly starship: StarshipVM;

  public constructor(data: StarshipDetailDto) {
    this.starship = new StarshipVM(data);
  }
}
