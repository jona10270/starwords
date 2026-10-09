import { ApiProperty } from '@nestjs/swagger';

import { PeopleVM } from '../../../../model/people/people.view-model';
import { PeopleWithIdDto } from '@app/modules/starwars/people/dto/people.all.dto';

export class PeopleSingleResponse {
  @ApiProperty({
    type: PeopleVM,
  })
  public readonly people: PeopleVM;

  public constructor(data: PeopleWithIdDto) {
    this.people = new PeopleVM(data);
  }
}
