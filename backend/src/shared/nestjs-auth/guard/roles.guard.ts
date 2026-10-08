import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserModel } from '@app/modules/user/domain/user.model';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRole } from '../domain/user-role';

// Dejo pasar solo a los roles que pide la ruta con @Roles()
@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no pide roles basta con haber pasado el guard del token
    if (!roles || roles.length === 0) return true;

    // Uso el rol del usuario que JwtStrategy leyo de la bd y no el del token
    const user = context.switchToHttp().getRequest<{ user?: UserModel }>().user;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
