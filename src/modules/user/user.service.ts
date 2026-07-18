import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './data/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dtos/user.create.dto';
import { UserModel } from './domain/user.model';
import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';

@Injectable()
export class UserService {
    public constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ){}

    // Only create user MAPPER
    public async create(user: UserCreateDto): Promise<UserModel> {
        const {
            email, username
        } = user;
        const hashedPasword= await bcrypt.hash(user.password, 10)
        const role= user?.role ?? UserRole.MAPPER

        const newUser = this.userRepository.create({
            email,
            username,
            password: hashedPasword,
            role,
            activated: true,
        })
        return newUser.save() 
    }

    // I check if the exiting email user 
    public async getByEmail(email: string): Promise<UserModel | null> {
        const user = await  this.userRepository.findOneBy({ email })
        if (!user) return null
        return user
    }

    // Method only delete user
    public async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id)
    }

    // Method for check user exists
    public async getByIdUser(id: string): Promise<UserModel | null> {
        const user= await this.userRepository.findOneBy({ id })
        if (!id) return null
        return user
    }
}