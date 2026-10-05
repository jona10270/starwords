import type { UseCase } from "@/core/lib";

import type { RegisterData } from "@/core/modules/auth/domain/AuthCredentials";
import type { AuthRepository } from "../domain/AuthRepository";

interface RegisterUseCaseProps {
    authRepository: AuthRepository;
}

export class RegisterUseCase implements UseCase<RegisterData, void> {
    private readonly authRepository: AuthRepository;

    constructor({ authRepository }: RegisterUseCaseProps) {
        this.authRepository = authRepository;
    }

    async execute(data: RegisterData): Promise<void> {
        // LLamo al backend para registrar el nuevo usuario
        await this.authRepository.register(data);
    }
}