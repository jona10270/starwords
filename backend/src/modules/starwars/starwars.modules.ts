import { Module } from "@nestjs/common";
import { SwapiRequest } from "./common/swapi.service";
import { PeopleService } from "./people/people.service";
import { StarwarsController } from "@app/app/rest/api/modules/starwars/controller/client/swapi.client.controller";
import { FilmService } from "./film/film.service";
import { StarshipService } from "./starships/starship.service";
import { VehiclesService } from "./vehicles/vehicles.service";
import { SpecieService } from "./specie/specie.service";
import { PlanetService } from "./planet/planet.service";


@Module({
    providers: [
        SwapiRequest,
        PeopleService,
        FilmService,
        StarshipService,
        VehiclesService,
        SpecieService,
        PlanetService,

    ],
    controllers: [
        StarwarsController
    ],
    exports: [
        PeopleService,
        FilmService,
        StarshipService,
        VehiclesService,
        SpecieService,
        PlanetService,
    ]
})

export class SwapiModule {}