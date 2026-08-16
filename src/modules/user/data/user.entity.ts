import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '@app/shared/nestjs-auth/domain/user-role';
import { UserModel } from '@app/modules/user/domain/user.model';

@Entity('users')
export class UserEntity extends BaseEntity implements UserModel {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar', { unique: true })
  public email!: string;

  @Column('varchar', { unique: true })
  public username!: string;

  @Column('varchar', { select: false })
  public password!: string;

  @Column('varchar', { default: UserRole.MAPPER })
  public role!: UserRole;

  @Column('boolean', { default: true })
  public activated!: boolean;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
