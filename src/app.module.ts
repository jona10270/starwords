import { Module, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresDatabaseModule } from './infra/postgres/postgres.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresDatabaseModule,
    UserModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
