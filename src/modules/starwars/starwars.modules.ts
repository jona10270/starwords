import { Module } from "@nestjs/common";
import { SwapiRequest } from "./common/swapi.service";
import { PeopleService } from "./people/people.service";
import { StarwarsController } from "@app/app/rest/api/modules/starwars/controller/client/swapi.client.controller";
import { FilmService } from "./film/film.service";

@Module({
    providers: [
        SwapiRequest,
        PeopleService,
        FilmService,
    ],
    controllers: [
        StarwarsController
    ],
    exports: [
        PeopleService,
        FilmService,
    ]
})

export class SwapiModule {}