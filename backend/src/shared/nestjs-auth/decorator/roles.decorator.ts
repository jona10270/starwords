import { SetMetadata, CustomDecorator } from '@nestjs/common';

import { UserRole } from '../domain/user-role';

export const ROLES_KEY = 'roles';

// Marco que roles pueden entrar en una ruta o en un controller entero
export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
