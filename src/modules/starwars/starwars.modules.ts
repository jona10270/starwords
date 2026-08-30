import { Module } from "@nestjs/common";
import { SwapiRequest } from "./common/swapi.service";
import { PeopleService } from "./people/people.service";
import { StarwarsController } from "@app/app/rest/api/modules/starwars/controller/client/swapi.client.controller";
import { FilmService } from "./film/film.service";
import { StarshipService } from "./starships/starship.service";
import { VehiclesService } from "./vehicles/vehicles.service";
import { SpecieService } from "./specie/specie.service";


@Module({
    providers: [
        SwapiRequest,
        PeopleService,
        FilmService,
        StarshipService,
        VehiclesService,
        SpecieService,

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
    ]
})

export class SwapiModule {}