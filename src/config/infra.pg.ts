import { get } from 'env-var'

export class InfraPgStorage {
  public static readonly DB_HOST: string = get('DB_HOST')
  .default('')
  .asString();

  public static readonly DB_PORT: number = get('DB_PORT')
  .default('5432')
  .asPortNumber();

  public static readonly DB_NAME: string = get('DB_NAME')
  .default('')
  .asString();

  public static readonly DB_USERNAME: string = get('DB_USERNAME')
  .default('')
  .asString();

  public static readonly DB_PASSWORD: string = get('DB_PASSWORD')
  .default('')
  .asString();

}
