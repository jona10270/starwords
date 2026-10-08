import { BadGatewayException, GatewayTimeoutException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

const SWAPI_TIMEOUT_MS = 5000;

// General request for all calls to the SWAPI API.
@Injectable()
export class SwapiRequest {
  private readonly BASE_URL = 'https://swapi.info/api';

  public async request<T>(endpoint: string): Promise<T> {
    try { 
      const response = await fetch(this.BASE_URL + endpoint, {signal: AbortSignal.timeout(SWAPI_TIMEOUT_MS)});

      if (response.status === 404) {
        throw new NotFoundException(
          'Resource not found or does not exist in the SWAPI API',
        );
      }

      if (!response.ok) {
        throw new BadGatewayException(`SWAPI responded with status: ${response.status}`);
      }

    return (await response.json()) as T;
    
    } catch (error) {
      // Si es un error de nest los dejamos pasar y ya como el 404
      if (error instanceof HttpException) {
        throw error;
      }

      // Si mi error es un 504 que es que swapi no response a tiempo lo corto
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new GatewayTimeoutException('Swapi did not respond in time');
      }

      // Cualquier otro fallos lo cortamos y lo tratamos como un 502
      throw new BadGatewayException('Could no connect to SWAPI');
    }

  }
}
