import { 
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn
} from 'typeorm';
import { FavoriteModel } from '../model/favorites.model';
import { UserEntity } from '@app/modules/user/data/user.entity';
import { ResourceTypeEnum } from '../enum/resource-type.enum';

@Entity('favorites')
@Unique(['userId', 'resourceId', 'resourceType'])
export class FavoritesEntity extends BaseEntity implements FavoriteModel {

    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column('varchar')
    public userId!: string;

    @Column('varchar')
    public resourceId!: string;

    @Column('varchar')
    public resourceType!: ResourceTypeEnum;

    @CreateDateColumn()
    public createdAt!: Date;

    @ManyToOne(() => UserEntity, user => user.favorites)
    @JoinColumn({ name: 'userId'})
    public user!: UserEntity;
}