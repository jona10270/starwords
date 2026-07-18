import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './data/user.entity';
import { UserService } from './user.service';
import { UserClientController } from '@app/app/rest/api/modules/user/controller/client/user.client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserClientController],
  providers: [UserService],                      
  exports: [UserService],
})
export class UserModule {}