import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@root/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Cart Id' })
  id: number;

  @ManyToOne(() => UserEntity, (users) => users.id)
  @Column({ name: 'user_id' })
  @ApiProperty({ description: 'User Id' })
  userId: number;

  @Column({ type: 'decimal', default: 0 })
  @ApiProperty({ description: 'Cart`s Total Price' })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Created Datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Updated Datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({ description: 'Deleted Datetime' })
  deletedAt: Date;
}
