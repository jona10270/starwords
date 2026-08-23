import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PeopleService } from '@app/modules/starwars/people/people.service';
import { FilmService } from '@app/modules/starwars/film/film.service';
import { PeopleManyResponse } from './response/people/swapi.client.many.response';
import { PeopleSingleResponse } from './response/people/swapi.client.single.response';
import { FilmManyResponse } from './response/film/film.client.many.response';
import { Public } from '@app/shared/nestjs-auth/decorator/public.decorator';

@Public()
@ApiBearerAuth()
@ApiTags('starwars')
@Controller('starwars')
export class StarwarsController {
  public constructor(
    private readonly peopleService: PeopleService,
    private readonly filmService: FilmService,
  ) {}

  // =====================================================
  // GET PEOPLE SWAPI
  // =====================================================

  // Get all peoples swapi
  @Get('people')
  @ApiOkResponse({
    type: PeopleManyResponse,
  })
  public async getAllPeople(): Promise<PeopleManyResponse> {
    return this.peopleService.getAllPeople();
  }

  // Get one people
  @Get('people/:id')
  @ApiOkResponse({
    type: PeopleSingleResponse,
  })
  public async getPeople(
    @Param('id') id: string
  ): Promise<PeopleSingleResponse>{
    return this.peopleService.getPeople(id)
  }

  // =====================================================
  // GET FILMS SWAPI
  // =====================================================

  @Get('films')
  @ApiOkResponse({
    type: PeopleManyResponse
  })
  public async getAllFilms(): Promise<FilmManyResponse> {
    return this.filmService.getAllFilms();
  }

}