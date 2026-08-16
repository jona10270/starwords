import {
  Body,
  Controller,
  Delete,
  ParseUUIDPipe,
  Param,
  NotFoundException,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersClientResponse } from './response/user.client.single.response';
import { UserService } from '@app/modules/user/user.service';
import { PaginationQueryDto } from './request/pagination.query.dto';
import { UserClientManyResponse } from './response/user.client.many.response';
import { UserEditDto } from './request/user.edit.dto';
import { CurrentUser } from '@app/shared/nestjs-auth/decorator/current-user.decorator';
import type { UserModel } from '@app/modules/user/domain/user.model';

// Todas las rutas de este controller exigen token (el guard global es quien manda).
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserClientController {
  public constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: UserClientManyResponse })
  public async listUsers(
    @Query() query: PaginationQueryDto,
  ): Promise<UserClientManyResponse> {
    const { page, limit } = query;
    const [users, total] = await this.userService.paginationUsers(page, limit);
    return new UserClientManyResponse(users, total, page, limit);
  }

  @Get('me')
  @ApiOkResponse({ type: UsersClientResponse })
  public getMe(@CurrentUser() user: UserModel): UsersClientResponse {
    return new UsersClientResponse(user);
  }

  @Get(':id')
  @ApiOkResponse({ type: UsersClientResponse })
  public async getUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UsersClientResponse> {
    const user = await this.userService.getOneUser(id);
    if (!user) throw new NotFoundException('The user does not exists');

    return new UsersClientResponse(user);
  }

  @Put(':id')
  @ApiOkResponse({ type: UserEditDto })
  public async editUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() me: UserModel,
    @Body() user: UserEditDto,
  ): Promise<UsersClientResponse | null> {
    // Check if users is the same user
    if (me.id !== id) {
      throw new NotFoundException('The user does not exists');
    }
    // called the service for edit user
    const updatedUser = await this.userService.editUser(id, user);

    return new UsersClientResponse(updatedUser);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UsersClientResponse })
  public async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() me: UserModel,
  ): Promise<UsersClientResponse> {
    if (me.id !== id) {
      throw new NotFoundException('The user to be delete does not exist');
    }
    const user = await this.userService.getByIdUser(id);
    if (!user)
      throw new NotFoundException('The user to be delete does not exist');

    await this.userService.deleteUser(id);

    return new UsersClientResponse(user);
  }
}
