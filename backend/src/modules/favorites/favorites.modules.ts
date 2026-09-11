import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoritesService } from "./favorites.services";
import { FavoritesEntity } from "./data/favorites.entity";
import { FavoriteController } from "@app/app/rest/api/modules/favorites/controller/client/favorites.controller";
import { UserModule } from "../user/user.module";
import { SwapiModule } from "../starwars/starwars.modules";

@Module({
  // Sirve para poder usar el entity en el service 
  imports: [
    TypeOrmModule.forFeature([FavoritesEntity]),
    UserModule,
    SwapiModule,
  ],
  controllers: [FavoriteController], // Para utilizar el controller
  providers: [FavoritesService],
  exports: [FavoritesService ],
})
export class FavoriteModule {}