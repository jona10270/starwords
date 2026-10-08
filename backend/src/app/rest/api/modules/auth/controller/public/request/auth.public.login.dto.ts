import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsLoginPassword,
  IsUserEmail,
} from '@app/app/common/validation/user-fields.validation';

// Validation DTO for the login request
export class AuthPublicLoginDto {
  @ApiProperty({ type: String, example: 'example@gmail.com' })
  @IsNotEmpty()
  @IsUserEmail()
  public email!: string;

  @ApiProperty({ type: String, example: '123456' })
  @IsNotEmpty()
  @IsLoginPassword()
  public password!: string;
}
