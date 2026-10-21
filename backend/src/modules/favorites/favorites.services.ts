import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { FavoriteModel, FavoriteWithNameModel } from './model/favorites.model';
import { FavoritesEntity } from './data/favorites.entity';
import { ResourceTypeEnum } from './enum/resource-type.enum';
import { isUniqueViolation } from '@app/infra/postgres/postgres-errors';
// Services
import { UserService } from '../user/user.service';
import { SwapiRequest } from '../starwars/common/swapi.service';
import {
  NamedResource,
  ResourceRefService,
} from '../starwars/common/resource-ref.service';

// Coleccion de swapi donde busco el nombre de cada tipo de favorito
const SWAPI_RESOURCES: Record<ResourceTypeEnum, NamedResource> = {
  [ResourceTypeEnum.PEOPLE]: 'people',
  [ResourceTypeEnum.FILM]: 'films',
  [ResourceTypeEnum.PLANET]: 'planets',
  [ResourceTypeEnum.SPECIE]: 'species',
  [ResourceTypeEnum.VEHICLE]: 'vehicles',
  [ResourceTypeEnum.STARSHIP]: 'starships',
};

@Injectable()
export class FavoritesService {
  public constructor(
    @InjectRepository(FavoritesEntity)
    private readonly favoriteRepository: Repository<FavoritesEntity>,
    private readonly userRepository: UserService,
    private readonly swapiService: SwapiRequest,
    private readonly resourceRefService: ResourceRefService,
  ) {}

  // =====================================================
  // CRUD OF FAVORITES
  // =====================================================

  // Function to add a favorite resource for a user
  public async addFavorite(
    userId: string,
    resourceId: string,
    resourceType: ResourceTypeEnum,
  ): Promise<FavoriteModel> {
    // Verify if the user exist
    const existingUser = await this.userRepository.getByIdUser(userId);

    if (!existingUser) {
      throw new NotFoundException('The user does not exist');
    }

    // Verifico si ya le sigo esta hecho de manera diferente
    if (await this.getFavorite(userId, resourceId, resourceType)) {
      throw new ConflictException('The favorite alredy exist');
    }

    // Verifico si el id de swapi existe, si no existe lanzo un error
    if (!(await this.resourceExist(resourceId, resourceType))) {
      throw new NotFoundException('The resource does not exist');
    }

    const newFavorite = this.favoriteRepository.create({
      userId,
      resourceId,
      resourceType,
    });

    try {
      return await newFavorite.save();
    } catch (error) {
      // Si llegan dos peticiones iguales a la vez lo para el indice unico
      if (isUniqueViolation(error)) {
        throw new ConflictException('The favorite alredy exist');
      }
      throw error;
    }
  }

  public async deleteFavorite(
    id: string,
    userId: string,
  ): Promise<FavoriteModel> {
    // Check de favorite exist and belong to the user
    const favorite = await this.favoriteRepository.findOne({
      where: { id, userId },
    });

    if (!favorite) {
      throw new NotFoundException(
        'Favorite not exist or not belong to the user',
      );
    }

    // If exist the user and the favorite belong to the user, then delete it
    await favorite.remove();
    return favorite;
  }

  // =====================================================
  // PAGINATION  OF FAVORITES
  // =====================================================

  // Pagination of favorites
  public async paginationFavorite(
    userId: string,
    page: number,
    limit: number,
  ): Promise<[FavoriteWithNameModel[], number]> {
    const [favorites, total] = await this.favoriteRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const favoritesWithName = await Promise.all(
      favorites.map((favorite) => this.withName(favorite)),
    );
    return [favoritesWithName, total];
  }

  public async getFavoritesStatus(
    userId: string,
    resourceType: ResourceTypeEnum,
    resourceIds: string[],
  ): Promise<FavoriteModel[]> {
    const favorites = this.favoriteRepository.find({
      where: {
        userId,
        resourceType,
        resourceId: In(resourceIds),
      },
    });
    return favorites;
  }

  // =====================================================
  // PRIVATE FUNCTIONS
  // =====================================================

  // Busco el nombre en las colecciones de swapi guardadas y si falla lo dejo a null para no tumbar la lista
  private async withName(
    favorite: FavoriteModel,
  ): Promise<FavoriteWithNameModel> {
    try {
      const name = await this.resourceRefService.getNameById(
        SWAPI_RESOURCES[favorite.resourceType],
        favorite.resourceId,
      );
      return { ...favorite, name };
    } catch {
      return { ...favorite, name: null };
    }
  }

  // Verifico si le tengo ya en favoritos
  private async getFavorite(
    userId: string,
    resourceId: string,
    resourceType: ResourceTypeEnum,
  ): Promise<FavoriteModel | null> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        userId,
        resourceId,
        resourceType,
      },
    });
    return favorite;
  }

  // Verifico si el id de swapi existe, si no existe lanzo un error
  private async resourceExist(
    resourceId: string,
    resourceType: ResourceTypeEnum,
  ): Promise<boolean> {
    switch (resourceType) {
      case ResourceTypeEnum.PEOPLE:
        return !!(await this.swapiService.request(`/people/${resourceId}`));

      case ResourceTypeEnum.FILM:
        return !!(await this.swapiService.request(`/films/${resourceId}`));

      case ResourceTypeEnum.PLANET:
        return !!(await this.swapiService.request(`/planets/${resourceId}`));

      case ResourceTypeEnum.SPECIE:
        return !!(await this.swapiService.request(`/species/${resourceId}`));

      case ResourceTypeEnum.VEHICLE:
        return !!(await this.swapiService.request(`/vehicles/${resourceId}`));

      case ResourceTypeEnum.STARSHIP:
        return !!(await this.swapiService.request(`/starships/${resourceId}`));

      default:
        throw new NotFoundException('Resource type not found');
    }
  }
}
