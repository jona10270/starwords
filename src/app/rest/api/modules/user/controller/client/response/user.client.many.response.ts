import { ApiProperty } from '@nestjs/swagger';

import { UserModel } from '@app/modules/user/domain/user.model';

import { UserVM } from '@app/app/rest/api/modules/user/model/user.view-model';

export class PaginationMetaVM {
    @ApiProperty({ type: Number, example: 100})
    public total: number;

    @ApiProperty({ type: Number, example: 2})
    public page: number;

    @ApiProperty({ type: Number, example: 10})
    public limit: number;

    @ApiProperty({ type: Number, example: 15})
    public totalPage: number;

    public constructor(total: number, page:number, limit: number) {
        this.total = total,
        this.page = page,
        this.limit = limit,
        this.totalPage = Math.ceil(total/limit)
    }  
}

export class UserClientManyResponse {
    @ApiProperty({ type: [UserVM]})
    public readonly users: UserVM[];

    @ApiProperty({ type: PaginationMetaVM }) 
    public readonly meta: PaginationMetaVM;

    public constructor(data: UserModel[], total: number, page: number, limit: number) {
        this.users = data.map((user) => new UserVM(user));
        this.meta = new PaginationMetaVM(total, page, limit)
    }
}