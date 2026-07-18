import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnection} from '@app/infra/postgres/postgres-connection'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => DatabaseConnection,
    }),
  ],
})
export class PostgresDatabaseModule {}
