import { 
  Body, 
  Controller, 
  ForbiddenException, 
  Post,UnprocessableEntityException, 
  Delete, 
  ParseUUIDPipe, 
  Param, 
  NotFoundException,
  Get,
  Put,
  Query
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './request/user.client.dto';
import { UsersClientResponse } from './response/user.client.single.response';
import { UserService } from '@app/modules/user/user.service';
import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';
import { PaginationQueryDto } from './request/pagination.query.dto';
import { UserClientManyResponse } from './response/user.client.many.response';
import { UserEditDto } from './request/user.edit.dto';

@ApiTags('users')
@Controller('users')
export class UserClientController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: UserClientManyResponse})
  public async listUsers(@Query() query: PaginationQueryDto): Promise<UserClientManyResponse> {
    const { page, limit } = query
    const [ users, total ] = await this.userService.paginationUsers(page, limit);
    return new UserClientManyResponse(users, total, page, limit)

  }

  @Get(':id')
  @ApiOkResponse({ type: UsersClientResponse })
  public async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<UsersClientResponse> {
    const user = await this.userService.getOneUser(id);
    if (!user)
      throw new NotFoundException('The user does not exists');

    return new UsersClientResponse(user);
  }

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

  @Put(':id')
  @ApiOkResponse({ type: UserEditDto })
  public async editUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UserEditDto
  ): Promise<UsersClientResponse | null> {

    // called the service for edit user
    const updatedUser= await this.userService.editUser(id, user)

    return new UsersClientResponse(updatedUser);
  }


  @Delete(':id')
  @ApiOkResponse({ type: UsersClientResponse})
  public async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<UsersClientResponse> {
    const user = await this.userService.getByIdUser(id);
    if ( !user )
      throw new NotFoundException('The user to be delete does not exist');

    await this.userService.deleteUser(id);

    return new UsersClientResponse(user);
  }









}
