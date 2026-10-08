import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDatabaseModule } from './infra/postgres/postgres.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthApiModule } from '@app/app/rest/api/modules/auth/auth.api.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/nestjs-auth/guard/jwt-auth.guard';
import { RolesGuard } from './shared/nestjs-auth/guard/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SwapiModule } from './modules/starwars/starwars.modules';
import { FavoriteModule } from './modules/favorites/favorites.modules';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresDatabaseModule,
    ThrottlerModule.forRoot([
      {
        // Limite de peticiones por IP para evitar ataques DDoS
        ttl: 60000,
        limit: 100,
      },
    ]),
    UserModule,
    AuthModule,
    AuthApiModule,
    SwapiModule,
    FavoriteModule,
  ],
  providers: [
    // Guardo el global de ThrottlerGuard para limitar las peticiones por IP y evitar ataques DDoS
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Guard global: todas las rutas piden token salvo las marcadas con @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Despues del token compruebo el rol en las rutas marcadas con @Roles()
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
