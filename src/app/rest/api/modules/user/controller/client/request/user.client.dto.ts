import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';

export class UserCreateDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public username!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @MinLength(4)
  public password!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  public role?: UserRole;
}
