import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoriteRequestDto } from './request/favorites.client.add.request';
import { FavoriterResponse } from './response/favorite.client.response';
import { FavoritesService } from '@app/modules/favorites/favorites.services';
import { FavoriteManyResponse } from './response/favorite.client.many.response';
import { CurrentUser } from '@app/shared/nestjs-auth/decorator/current-user.decorator';
import type { UserModel } from '@app/modules/user/domain/user.model';
import { PaginationFavoriteQueryDto } from './request/pagination.query.dto';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoritesService) {}

  @Get()
  @ApiOkResponse({ type: FavoriteManyResponse })
  public async listFavorites(
    @CurrentUser() user: UserModel,
    @Query() query: PaginationFavoriteQueryDto,
  ): Promise<FavoriteManyResponse> {
    const { page, limit } = query;
    const [favorites, total] = await this.favoriteService.paginationFavorite(
      user.id,
      page,
      limit,
    );
    return new FavoriteManyResponse(favorites, total, page, limit);
  }

  @Post()
  @ApiBody({ type: FavoriteRequestDto })
  @ApiOkResponse({ type: FavoriterResponse })
  public async addFavorite(
    @CurrentUser() user: UserModel,
    @Body() client: FavoriteRequestDto,
  ): Promise<FavoriterResponse> {
    const data = await this.favoriteService.addFavorite(
      user.id,
      client.resourceId,
      client.resourceType,
    );

    return new FavoriterResponse(data);
  }

  @Delete(':id')
  @ApiOkResponse({ type: FavoriterResponse })
  public async removeFavorite(
    @CurrentUser() user: UserModel,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FavoriterResponse> {
    const data = await this.favoriteService.deleteFavorite(id, user.id);

    return new FavoriterResponse(data);
  }
}
