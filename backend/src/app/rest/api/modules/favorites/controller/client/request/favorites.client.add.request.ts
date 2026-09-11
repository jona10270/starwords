import { ApiProperty } from "@nestjs/swagger";
import { ResourceTypeEnum } from "@app/modules/favorites/enum/resource-type.enum";
import { IsNotEmpty, IsString } from "class-validator";

export class FavoriteRequestDto {
    @ApiProperty({ type: String, example: '1'})
    @IsNotEmpty()
    @IsString()
    public userId!: string;

    @ApiProperty({ type: String, example: '1'})
    @IsNotEmpty()
    @IsString()
    public resourceId!: string;

    @ApiProperty({ type: String, example: 'PEOPLE'})
    @IsNotEmpty()
    @IsString()
    public resourceType!: ResourceTypeEnum;
}