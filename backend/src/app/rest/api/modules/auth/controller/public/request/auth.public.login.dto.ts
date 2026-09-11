import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Validation DTO for the login request
export class AuthPublicLoginDto {
  @ApiProperty({ type: String, example: 'example@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @ApiProperty({ type: String, example: '123456' })
  @IsNotEmpty()
  @IsString()
  public password!: string;
}
