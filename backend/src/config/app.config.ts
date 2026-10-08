import { get } from 'env-var';

export class AppConfig {
  // Origen del frontend al que dejo hacer peticiones sin barra final porque el navegador lo compara exacto
  public static readonly CORS_ORIGIN: string = get('CORS_ORIGIN')
    .default('http://localhost:5173')
    .asString();
}
