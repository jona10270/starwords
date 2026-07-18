import { Body, Controller, ForbiddenException, Post, UnprocessableEntityException, Delete, ParseUUIDPipe, Param, NotFoundException } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './request/user.client.dto';
import { UsersClientResponse } from './response/user.client.single.response';
import { UserService } from '@app/modules/user/user.service';
import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';

@ApiTags('users')
@Controller('users')
export class UserClientController {
  constructor(private readonly userService: UserService) {}cmd
  

  @Post()
  @ApiBody({ type: UserCreateDto })
  @ApiOkResponse({ type: UsersClientResponse })
  public async createUser(@Body() client: UserCreateDto): Promise<UsersClientResponse> {
    if ( client?.role === UserRole.ADMIN  )
      throw new ForbiddenException('The user cannot have the ADMIN role');

    // I check exists if email
    if ( await this.userService.getByEmail(client.email))
      throw new UnprocessableEntityException('The email of new user exists');

    return new UsersClientResponse(await this.userService.create(client));
  }

  @Delete(':id')
  @ApiOkResponse({ type: UsersClientResponse})
  public async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<UsersClientResponse> {
    const user = await this.userService.getByIdUser(id)
    if ( !user )
      throw new NotFoundException('The user to be delete does not exist');

    await this.userService.deleteUser(id)

    return new UsersClientResponse(user)
  }





}
