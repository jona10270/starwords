import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '@app/app/common/pagination/pagination.query.dto';

// Services
import { PeopleService } from '@app/modules/starwars/people/people.service';
import { FilmService } from '@app/modules/starwars/film/film.service';
import { StarshipService } from '@app/modules/starwars/starships/starship.service';
import { VehiclesService } from '@app/modules/starwars/vehicles/vehicles.service';
import { SpecieService } from '@app/modules/starwars/specie/specie.service';
import { PlanetService } from '@app/modules/starwars/planet/planet.service';

// Many response
import { PeopleManyResponse } from './response/people/swapi.client.many.response';
import { FilmManyResponse } from './response/film/film.client.many.response';
import { StarshipManyResponse } from './response/starship/starship.client.many.response';
import { VehiclesManyResponse } from './response/vehicle/vehicles.client.many.response';
import { SpecieManyResponse } from './response/specie/specie.client.many.response';
import { PlanetManyResponse } from './response/planet/planet.client.many.response';

// Single response
import { PeopleSingleResponse } from './response/people/swapi.client.single.response';
import { FilmSingleResponse } from './response/film/film.client.single.response';
import { StarshipSingleResponse } from './response/starship/starship.client.single.response';
import { VehicleSingleResponse } from './response/vehicle/vehicle.client.single.response';
import { SpecieSingleResponse } from './response/specie/specie.client.single.response';
import { PlanetSingleResponse } from './response/planet/planet.client.single.response';

import { Public } from '@app/shared/nestjs-auth/decorator/public.decorator';
import { SearchPaginationQueryDto } from '@app/app/common/pagination/search-pagination.query.dto';

@Public()
@ApiBearerAuth()
@ApiTags('starwars')
@Controller('starwars')
export class StarwarsController {
  public constructor(
    private readonly peopleService: PeopleService,
    private readonly filmService: FilmService,
    private readonly starship: StarshipService,
    private readonly vehicle: VehiclesService,
    private readonly specie: SpecieService,
    private readonly planet: PlanetService,
  ) {}

  // =====================================================
  // GET PEOPLE SWAPI
  // =====================================================

  // Get all peoples swapi
  @Get('people')
  @ApiOkResponse({
    type: PeopleManyResponse,
  })
  public async getAllPeople(
    @Query() query: SearchPaginationQueryDto,
  ): Promise<PeopleManyResponse> {
    const { page, limit, search } = query;
    return this.peopleService.getAllPeople(page, limit, search);
  }

  // Get one people
  @Get('people/:id')
  @ApiOkResponse({
    type: PeopleSingleResponse,
  })
  public async getPeople(
    @Param('id') id: string,
  ): Promise<PeopleSingleResponse> {
    return this.peopleService.getPeople(id);
  }

  // =====================================================
  // GET FILMS SWAPI
  // =====================================================

  // Get all films of the swapi api
  @Get('films')
  @ApiOkResponse({
    type: FilmManyResponse,
  })
  public async getAllFilms(
    @Query() query: SearchPaginationQueryDto,
  ): Promise<FilmManyResponse> {
    const { page, limit, search } = query;
    return this.filmService.getAllFilms(page, limit, search);
  }

  // Get one film
  @Get('films/:id')
  @ApiOkResponse({
    type: FilmSingleResponse,
  })
  public async getFilm(@Param('id') id: string): Promise<FilmSingleResponse> {
    return this.filmService.getFilm(id);
  }

  // =====================================================
  // GET STARSHIPS SWAPI
  // =====================================================

  @Get('starships')
  @ApiOkResponse({
    type: StarshipManyResponse,
  })
  public async getStarships(
    @Query() query: PaginationQueryDto,
  ): Promise<StarshipManyResponse> {
    const { page, limit } = query;
    return this.starship.getAllStarships(page, limit);
  }

  @Get('starships/:id')
  @ApiOkResponse({
    type: StarshipSingleResponse,
  })
  public async getStarship(
    @Param('id') id: string,
  ): Promise<StarshipSingleResponse> {
    return this.starship.getSingleStarship(id);
  }

  // =====================================================
  // GET VEHICLES SWAPI
  // =====================================================

  @Get('vehicles')
  @ApiOkResponse({
    type: VehiclesManyResponse,
  })
  public async getAllVehicles(
    @Query() query: PaginationQueryDto,
  ): Promise<VehiclesManyResponse> {
    const { page, limit } = query;
    return this.vehicle.getAllVehicles(page, limit);
  }

  @Get('vehicles/:id')
  @ApiOkResponse({
    type: VehicleSingleResponse,
  })
  public async getVehicle(
    @Param('id') id: string,
  ): Promise<VehicleSingleResponse> {
    return this.vehicle.getVehicle(id);
  }

  // =====================================================
  // GET SPECIES SWAPI
  // =====================================================

  @Get('species')
  @ApiOkResponse({
    type: SpecieManyResponse,
  })
  public async getAllSpecies(
    @Query() query: PaginationQueryDto,
  ): Promise<SpecieManyResponse> {
    const { page, limit } = query;
    return this.specie.getSpecies(page, limit);
  }

  @Get('species/:id')
  @ApiOkResponse({
    type: SpecieSingleResponse,
  })
  public async getSingleSpecie(
    @Param('id') id: string,
  ): Promise<SpecieSingleResponse> {
    return this.specie.getSpecie(id);
  }

  // =====================================================
  // GET PLANETS SWAPI
  // =====================================================

  @Get('planets')
  @ApiOkResponse({
    type: PlanetManyResponse,
  })
  public async getAllPlanets(
    @Query() query: PaginationQueryDto,
  ): Promise<PlanetManyResponse> {
    const { page, limit } = query;
    return this.planet.getPlanets(page, limit);
  }

  @Get('planets/:id')
  @ApiOkResponse({
    type: PlanetSingleResponse,
  })
  public async getSinglePlanet(
    @Param('id') id: string,
  ): Promise<PlanetSingleResponse> {
    return this.planet.getPlanet(id);
  }
}
