import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '@app/modules/user/user.service';
import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';
import { Public } from '@app/shared/nestjs-auth/decorator/public.decorator';
import { UserCreateDto } from '../client/request/user.client.dto';
import { UsersClientResponse } from '../client/response/user.client.single.response';

// Registro de usuarios: la unica ruta de /users accesible sin token.
@ApiTags('users')
@Controller('users')
export class UserPublicController {
  public constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiBody({ type: UserCreateDto })
  @ApiOkResponse({ type: UsersClientResponse })
  public async createUser(
    @Body() client: UserCreateDto,
  ): Promise<UsersClientResponse> {
    if (client?.role === UserRole.ADMIN)
      throw new ForbiddenException('The user cannot have the ADMIN role');

    // I check exists if email
    if (await this.userService.getByEmail(client.email))
      throw new UnprocessableEntityException('The email of new user exists');

    return new UsersClientResponse(await this.userService.create(client));
  }
}
