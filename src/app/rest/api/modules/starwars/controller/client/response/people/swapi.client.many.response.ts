import { ApiProperty } from '@nestjs/swagger';

import { PeopleAllDto } from '@app/modules/starwars/people/dto/people.all.dto';
import { PeopleVM } from '../../../../model/people/people.view-model';

export class PeopleManyResponse {
  @ApiProperty({
    type: [PeopleVM],
  })
  public readonly people: PeopleVM[];

  public constructor(data: PeopleAllDto[]) {
    this.people = data.map((person) => new PeopleVM(person));
  }
}