import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  IsNewPassword,
  IsUserEmail,
  IsUsername,
} from '@app/app/common/validation/user-fields.validation';

// DTO for the edit users con las mismas reglas que el registro
export class UserEditDto {
  @ApiPropertyOptional({ type: String, example: 'example@gmail.com' })
  @IsOptional()
  @IsUserEmail()
  public email?: string;

  @ApiPropertyOptional({ type: String, example: 'jorge_99' })
  @IsOptional()
  @IsUsername()
  public username?: string;

  @ApiPropertyOptional({ type: String, example: '123456' })
  @IsOptional()
  @IsNewPassword()
  public password?: string;
}
