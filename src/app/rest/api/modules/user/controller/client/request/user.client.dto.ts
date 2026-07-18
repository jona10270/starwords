import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from "@app/shared/nestjs-auth/domain/user-role";

export class UserCreateDto {
    @ApiPropertyOptional({ type: String})
    @IsNotEmpty()
    @IsString()
    public username!: string;

    @ApiPropertyOptional({ type: String })
    @IsNotEmpty()
    @IsEmail()
    public email!: string;

    @ApiPropertyOptional({ type: String})
    @IsNotEmpty()
    @MinLength(4)
    public password!: string;

    @ApiPropertyOptional({ type: String, nullable: true })
    @IsOptional()
    @IsEnum(UserRole)
    public role?: UserRole;
}