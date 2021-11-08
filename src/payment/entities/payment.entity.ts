import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payment')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Payment Id' })
  id: number;

  @ManyToOne(() => UserEntity, (users) => users.id)
  @Column({ name: 'user_id' })
  @ApiProperty({ description: 'User Id' })
  userId: number;

  @Column()
  @ApiProperty({ description: 'Provider' })
  provider: string;

  @Column()
  @ApiProperty({ description: 'Status' })
  status: boolean;

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
