import { ApiProperty } from '@nestjs/swagger';

import { PeopleDetailDto } from '@app/modules/starwars/people/dto/people.all.dto';
import { PeopleVM } from '../../../../model/people/people.view-model';
import { PaginationMetaVM } from '@app/app/common/pagination/pagination-meta.view-model';

export class PeopleManyResponse {
  @ApiProperty({
    type: [PeopleVM],
  })
  public readonly people: PeopleVM[];

  @ApiProperty({
    type: PaginationMetaVM,
  })
  public readonly meta: PaginationMetaVM;

  public constructor(
    data: PeopleDetailDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.people = data.map((person) => new PeopleVM(person));
    this.meta = new PaginationMetaVM(total, page, limit);
  }
}
