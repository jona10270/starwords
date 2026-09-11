import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

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
import { PlanerManyResponse } from './response/planet/planet.client.many.response';

// Single response
import { PeopleSingleResponse } from './response/people/swapi.client.single.response';
import { FilmSingleResponse } from './response/film/film.client.single.response';
import { StarshipSingleResponse } from './response/starship/starship.client.single.response';
import { VehicleSingleResponse } from './response/vehicle/vehicle.client.single.response';
import { SpecieSingleResponse } from './response/specie/specie.client.single.response';
import { PlanetSingleResponse } from './response/planet/planet.client.single.response';

import { Public } from '@app/shared/nestjs-auth/decorator/public.decorator';

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
    private readonly planet: PlanetService
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

  @Get('starships/:id')
  @ApiOkResponse({
    type: StarshipSingleResponse,
  })

  public async getStarship(
    @Param( 'id' ) id : string
  ): Promise<StarshipSingleResponse> {
    return this.starship.getSingleStarship(id)
  }

  // =====================================================
  // GET VEHICLES SWAPI
  // =====================================================

  @Get('vehicles')
  @ApiOkResponse({
    type: VehiclesManyResponse,
  })

  public async getAllVehicles(): Promise<VehiclesManyResponse> {
    return this.vehicle.getAllVehicles()
  }

  @Get('vehicles/:id')
  @ApiOkResponse({
    type: VehicleSingleResponse,
  })

  public async getVehicle(
    @Param('id') id: string
  ): Promise<VehicleSingleResponse> {
    return this.vehicle.getVehicle(id)
  }

  // =====================================================
  // GET SPECIES SWAPI
  // =====================================================

  @Get('species')
  @ApiOkResponse({
    type: SpecieManyResponse,
  })
  public async getAllSpecies(): Promise <SpecieManyResponse> {
    return this.specie.getSpecies()
  }

  @Get('species/:id')
  @ApiOkResponse({
    type: SpecieSingleResponse,
  })

  public async getSingleSpecie(
    @Param('id') id: string
  ): Promise<SpecieSingleResponse> {
    return this.specie.getSpecie(id)
  }

  // =====================================================
  // GET PLANETS SWAPI
  // =====================================================

  @Get('planets')
  @ApiOkResponse({
    type: PlanerManyResponse,
  })

  public async getAllPlanets(): Promise<PlanerManyResponse> {
    return this.planet.getPlanets()
  }

  @Get('planets/:id')
  @ApiOkResponse({
    type: PlanetSingleResponse,
  })

  public async getSinglePlanet(
    @Param('id') id: string
  ): Promise<PlanetSingleResponse> {
    return this.planet.getPlanet(id)
  }
}