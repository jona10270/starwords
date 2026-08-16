import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DatabaseConnection } from './postgres-connection';

const appDataSource = new DataSource(DatabaseConnection);

export const Db_star_words = appDataSource;
