import { Module } from "@nestjs/common";
import { SwapiRequest } from "./common/swapi.service";
import { PeopleService } from "./people/people.service";
import { StarwarsController } from "@app/app/rest/api/modules/starwars/swapi.client.controller";

@Module({
    providers: [
        SwapiRequest,
        PeopleService
    ],
    controllers: [
        StarwarsController
    ],
    exports: [
        PeopleService
    ]
})

export class SwapiModule {}