import { ApiProperty } from '@nestjs/swagger';
import { StarshipVM } from '../../../../model/starship/starship.view-model';
import { StarshipWithIdDto } from '@app/modules/starwars/starships/dto/starship.all.dto';

export class StarshipSingleResponse {
  @ApiProperty({
    type: StarshipVM,
  })
  public readonly starship: StarshipVM;

  public constructor(data: StarshipWithIdDto) {
    this.starship = new StarshipVM(data);
  }
}
