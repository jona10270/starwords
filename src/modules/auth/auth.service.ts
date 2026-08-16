import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@app/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadModel } from './domain/jwt-payload.model';
import * as bcrypt from 'bcrypt';
import { AuthConfig } from '@app/config/auth.config';
import { AuthTokenModel } from './domain/auth-token.model';

const DUMMY_HASH =
  '$2b$12$C6UzMDM.H6dfI/f/IKcEe.MjLLQBRvXFcCPLfCEUJXOWpQBaWkTFy';

@Injectable()
export class AuthService {
  public constructor(
    // Para buscar el usuario y generar el token JWT
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(email: string, password: string): Promise<AuthTokenModel> {
    // Comprobamos si el usuario existe
    const user = await this.userService.getByEmail(email);

    // Valido la contraseña del usuario con bcrypt
    const isValidPassword = await bcrypt.compare(
      password,
      user?.password ?? DUMMY_HASH,
    );

    // Si algo falla lo matamos con un error
    if (!user || !isValidPassword || !user.activated) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generamos el token JWT
    const payload: JwtPayloadModel = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, expiresIn: AuthConfig.JWT_EXPIRATION };
  }
}
