import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

// DTO for the edit users
export class UserEditDto {
  @ApiPropertyOptional({ type: String, example: 'example@gmail.com' })
  @IsOptional()
  @IsEmail()
  public email?: string;

  @ApiPropertyOptional({ type: String, example: 'Jorge' })
  @IsOptional()
  @IsString()
  public username?: string;

  @ApiPropertyOptional({ type: String, example: '123456' })
  @IsOptional()
  @IsString()
  public password?: string;
}
