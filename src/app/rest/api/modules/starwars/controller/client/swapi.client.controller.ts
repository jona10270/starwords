import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Services
import { PeopleService } from '@app/modules/starwars/people/people.service';
import { FilmService } from '@app/modules/starwars/film/film.service';
import { StarshipService } from '@app/modules/starwars/starships/starship.service';
// Many response
import { PeopleManyResponse } from './response/people/swapi.client.many.response';
import { FilmManyResponse } from './response/film/film.client.many.response';
import { StarshipManyResponse } from './response/starship/starship.client.many.response';
// Single response
import { PeopleSingleResponse } from './response/people/swapi.client.single.response';
import { FilmSingleResponse } from './response/film/film.client.single.response';

import { Public } from '@app/shared/nestjs-auth/decorator/public.decorator';

@Public()
@ApiBearerAuth()
@ApiTags('starwars')
@Controller('starwars')
export class StarwarsController {
  public constructor(
    private readonly peopleService: PeopleService,
    private readonly filmService: FilmService,
    private readonly starship: StarshipService
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

  // Get all films of the swapi api
  @Get('films')
  @ApiOkResponse({
    type: PeopleManyResponse
  })
  public async getAllFilms(): Promise<FilmManyResponse> {
    return this.filmService.getAllFilms();
  }

  // Get one film 
  @Get('films/:id')
  @ApiOkResponse({
    type: FilmSingleResponse,
  })
  public async getFilm(
    @Param('id') id: string
  ): Promise<FilmSingleResponse> {
    return this.filmService.getFilm(id)
  }

  // =====================================================
  // GET STARSHIPS SWAPI
  // =====================================================

  @Get('starships')
  @ApiOkResponse({
    type: StarshipManyResponse,
  })
  public async getStarships(): Promise<StarshipManyResponse> {
    return this.starship.getAllStarships()
  }

}