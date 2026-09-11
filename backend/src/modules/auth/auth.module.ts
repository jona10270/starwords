import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfig } from '@app/config/auth.config';
import { UserModule } from '@app/modules/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from '@app/shared/nestjs-auth/strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: AuthConfig.JWT_SECRET,
      signOptions: { expiresIn: AuthConfig.JWT_EXPIRATION },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
