// La forma exacta de los datos que envío y recibo del backend
export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    auth: {
        accessToken: string;
        tokenType: string;
        expiresIn: number;
    };
}

export interface RegisterRequestDTO {
    username: string;
    email: string;
    password: string;
}

export interface MeResponseDTO {
    user: {
        id: string;
        username: string;
        email: string;
        role: string;
        activated: boolean;
    };
}