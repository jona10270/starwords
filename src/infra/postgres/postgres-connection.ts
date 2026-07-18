import { DataSourceOptions } from "typeorm";
import { resolve } from "path";
import { InfraPgStorage } from '../../config/infra.pg'
import { modulesDirPath } from '@app/modules/index'

const currentPath: string = resolve(__dirname);

export const DatabaseConnection: DataSourceOptions = {
    type: 'postgres',
    host: InfraPgStorage.DB_HOST,
    port: InfraPgStorage.DB_PORT,
    username: InfraPgStorage.DB_USERNAME,
    password: InfraPgStorage.DB_PASSWORD,
    database: InfraPgStorage.DB_NAME,
    migrationsTableName: 'migrations',
    entities: [`${modulesDirPath}/**/data/*.entity.{js,ts}`],
    migrations: [`${currentPath}/migrations/*.{js,ts}`],
    synchronize: false,
    logging: false,


}

