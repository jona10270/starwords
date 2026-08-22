import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PeopleService } from '@app/modules/starwars/people/people.service';
import { PeopleManyResponse } from './response/swapi.client.many.response';

@ApiBearerAuth()
@ApiTags('starwars')
@Controller('starwars')
export class StarwarsController {
  public constructor(
    private readonly peopleService: PeopleService,
  ) {}

  @Get('people')
  @ApiOkResponse({
    type: PeopleManyResponse,
  })
  public async getAllPeople(): Promise<PeopleManyResponse> {
    return this.peopleService.getAllPeople();
  }
}