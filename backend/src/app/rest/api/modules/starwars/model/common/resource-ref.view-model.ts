import { ApiPropertyOptional } from "@nestjs/swagger";
import { ResourceRefDto } from "@app/modules/starwars/common/resource-ref.dto";

export class ResourceRefVM {
    
    @ApiPropertyOptional({type: String, example: '1'})
    public readonly id: string;

    @ApiPropertyOptional({type: String, example: 'hoka mo'})
    public readonly title: string;

    constructor(resourceRef: ResourceRefDto) {
        this.id = resourceRef.id;
        this.title = resourceRef.title;
    }
}