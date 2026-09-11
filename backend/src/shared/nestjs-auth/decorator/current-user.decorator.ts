import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserModel } from '@app/modules/user/domain/user.model';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserModel =>
    ctx.switchToHttp().getRequest<{ user: UserModel }>().user,
);
