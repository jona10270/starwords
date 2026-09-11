import { Module } from '@nestjs/common';

import { AuthModule } from '@app/modules/auth/auth.module';
import { AuthPublicController } from './controller/public/auth.public.controller';

@Module({
  imports: [AuthModule],
  controllers: [AuthPublicController],
})
export class AuthApiModule {}
