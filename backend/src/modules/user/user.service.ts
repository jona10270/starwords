import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './data/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dtos/user.create.dto';
import { UserModel } from './domain/user.model';
import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';
import { UserEditDto } from './dtos/user.edit.dto';
import { UserCheckDto } from './domain/user.model.check.dto';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Only create user MAPPER
  public async create(user: UserCreateDto): Promise<UserModel> {
    const { email, username } = user;
    const hashedPasword = await bcrypt.hash(user.password, 10);
    const role = user?.role ?? UserRole.MAPPER;

    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPasword,
      role,
      activated: true,
    });
    return newUser.save();
  }

  // I check if the exiting email user
  public async getByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) return null;
    return user;
  }

  // Check only email and username exists
  public async checkEmailAndUsernameExists(
    email: string,
    username: string,
    excludeUserId?: string,
  ): Promise<UserCheckDto> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .select(['user.email', 'user.username'])
      .where('(user.email = :email OR user.username = :username)', {
        email,
        username,
      });

    if (excludeUserId) {
      query.andWhere('user.id != :excludeUserId', { excludeUserId });
    }
    return (await query.getOne()) ?? {};
  }

  // Method only delete user
  public async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Method for check user exists only for check exist user
  public async getByIdUser(id: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;
    return user;
  }

  // Method for get user only get
  public async getOneUser(id: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;
    return user;
  }

  public async editUser(
    userId: string,
    toUpdate: UserEditDto,
  ): Promise<UserModel> {
    // Check if user exists before updating
    const existingUser = await this.getByIdUser(userId);

    if (!existingUser) {
      throw new NotFoundException('The user to be edited does not exist');
    }

    const existData = await this.checkEmailAndUsernameExists(
      toUpdate.email ?? '',
      toUpdate.username ?? '',
      userId,
    );

    if (existData.email || existData.username) {
      throw new ConflictException('Email or username already exists');
    }

    //Update the user if something is sent
    const updateUser: UserEditDto & { updatedAt: Date } = {
      updatedAt: new Date(),
      ...toUpdate,
    };

    // Valido el usuario al crealo quitando los espacions
    if (toUpdate.username) {
      const fullname = toUpdate.username.trim();
      updateUser.username = fullname;
    }

    // Hasheo la contraseña si se cambia la contraseña del usuario
    if (toUpdate.password) {
      const hashedPassword = await bcrypt.hash(toUpdate.password, 10);
      updateUser.password = hashedPassword;
    }

    // Update the user in the database
    await this.userRepository.update(userId, updateUser);

    // Search the user by id and send it the user update
    const newUpdateUser = await this.getByIdUser(userId);

    if (!newUpdateUser) {
      throw new NotFoundException(
        'The user edited does not exist afeter the update user',
      );
    }

    return newUpdateUser;
  }

  // Method for list all users with pagination
  public async paginationUsers(
    page: number,
    limit: number,
  ): Promise<[UserModel[], number]> {
    const pusers = this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return pusers;
  }
}
