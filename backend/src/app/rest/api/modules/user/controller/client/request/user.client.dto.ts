import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';
import {
  IsNewPassword,
  IsUserEmail,
  IsUsername,
} from '@app/app/common/validation/user-fields.validation';

export class UserCreateDto {
  @ApiProperty({ type: String, example: 'luke_sky' })
  @IsNotEmpty()
  @IsUsername()
  public username!: string;

  @ApiProperty({ type: String, example: 'luke@example.com' })
  @IsNotEmpty()
  @IsUserEmail()
  public email!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNewPassword()
  public password!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  public role?: UserRole;
}
