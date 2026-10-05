import { ApiProperty } from "@nestjs/swagger";
import { ResourceTypeEnum } from "@app/modules/favorites/enum/resource-type.enum";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";

export class FavoriteRequestDto {

    @ApiProperty({ type: String, example: '1'})
    @IsNotEmpty()
    @IsString()
    public resourceId!: string;

    @ApiProperty({ type: String, example: 'PEOPLE'})
    @IsNotEmpty()
    @IsEnum(ResourceTypeEnum, { message: 'Invalid resource type' })
    public resourceType!: ResourceTypeEnum;
}