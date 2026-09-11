import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '@app/modules/user/user.service';
import { AuthConfig } from '@app/config/auth.config';
import { JwtPayloadModel } from '@app/modules/auth/domain/jwt-payload.model';
import { UserModel } from '@app/modules/user/domain/user.model';

// Valido el token recibido en la cabecera de la peticion HTTP
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  public constructor(private readonly userService: UserService) {
    super({
      // De donde saco los datos del token JWT: la cabecera de la peticion HTTP
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConfig.JWT_SECRET,
      algorithms: ['HS256'],
    });
  }

  public async validate(payload: JwtPayloadModel): Promise<UserModel> {
    // Busco el usuario en la DB
    const user = await this.userService.getByIdUser(payload.sub);

    if (!user || !user.activated) {
      throw new UnauthorizedException('User not found or not activated');
    }

    // Lo que devuelvo se guarda en request.user
    return user;
  }
}
