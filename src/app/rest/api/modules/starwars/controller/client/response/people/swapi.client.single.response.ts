import { ApiProperty } from '@nestjs/swagger';

import { PeopleSingleDto } from '@app/modules/starwars/people/dto/people.single.dto';
import { PeopleVM } from '../../../../model/people/people.view-model';

export class PeopleSingleResponse {
  @ApiProperty({
    type: PeopleVM,
  })
  public readonly people: PeopleVM;

  public constructor(data: PeopleSingleDto) {
    this.people = new PeopleVM(data);
  }
}