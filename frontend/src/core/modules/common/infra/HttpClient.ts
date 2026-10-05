import axios, { type AxiosInstance } from 'axios';

import { HttpError } from './HttpError';

// Tiempo maximo de espera de una peticion en milisegundos
const DEFAULT_TIMEOUT_MS = 10_000;

// Para hacer una peticion necesitamos estos 3 campos y el timeout es opcional
interface HttpClientProps {
    baseUrl: string;
    getToken: () => string | null;
    onUnauthorized: () => void;
    timeoutMs?: number;
};

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

// Filtros que van en la url como ?search=luke&page=2
type HttpParams = Record<string, string | number | boolean>;

// Lo que necesita el metodo privado para hacer cualquier peticion
interface RequestOptions {
    method: HttpMethod;
    url: string;
    body?: object;
    params?: HttpParams;
};

export class HttpClient {
    private readonly api: AxiosInstance;

    // Toda peticion tiene que llevar el HttpClientProps
    constructor({ baseUrl, getToken, onUnauthorized, timeoutMs = DEFAULT_TIMEOUT_MS }: HttpClientProps) {
        this.api = axios.create({ baseURL: baseUrl, timeout: timeoutMs });

        // Intercepto para agregar el token a la cabecera de la peticion si es valido si no ira vacio
        this.api.interceptors.request.use((request) => {
            const token = getToken();

            if (token) {
                request.headers.Authorization = `Bearer ${token}`;
            }
            return request;
        })

        // Cojo la respuesta de la peticion y si falla la convierto en un HttpError con su estado
        this.api.interceptors.response.use((response) => response, (error: unknown) => {
            // Si no es un error de axios es un fallo de mi codigo y lo dejo pasar tal cual
            if (!axios.isAxiosError(error)) return Promise.reject(error);

            // Sin respuesta del servidor ni por timeout no hay estado y lo dejo en null
            const status = error.response?.status ?? null;

            // Un 401 con token guardado significa que la sesion ha caducado
            if (status === 401 && getToken() !== null) onUnauthorized();

            return Promise.reject(new HttpError(status, error));
        })
    }

    // Hago cualquier peticion en un solo sitio y devuelvo solo el cuerpo de la respuesta
    private async request<T>({ method, url, body, params }: RequestOptions): Promise<T> {
        const response = await this.api.request<T>({ method, url, data: body, params });
        return response.data;
    }

    get<T>(url: string, params?: HttpParams): Promise<T> {
        return this.request<T>({ method: 'get', url, params });
    }

    post<T>(url: string, body: object): Promise<T> {
        return this.request<T>({ method: 'post', url, body });
    }

    put<T>(url: string, body: object): Promise<T> {
        return this.request<T>({ method: 'put', url, body });
    }

    patch<T>(url: string, body: object): Promise<T> {
        return this.request<T>({ method: 'patch', url, body });
    }

    delete<T>(url: string): Promise<T> {
        return this.request<T>({ method: 'delete', url });
    }
}
