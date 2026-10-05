// Donde guardo el token y los milisegundos en que caduca el token
export interface AuthSession {
    accessToken: string;
    expiresAt: number;
}