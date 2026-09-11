import { get } from 'env-var';

export class AuthConfig {
  public static readonly JWT_SECRET: string = get('JWT_SECRET')
    .required()
    .asString();

  public static readonly JWT_EXPIRATION: number = get('JWT_EXPIRATION')
    .default('900')
    .asIntPositive();
}
