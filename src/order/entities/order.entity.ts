import { ApiProperty } from '@nestjs/swagger';
import { PaymentEntity } from '@root/payment/entities/payment.entity';
import {
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Order Id' })
  id: number;

  @ManyToOne(() => UserEntity, (users) => users.id)
  @Column({ name: 'user_id' })
  @ApiProperty({ description: 'User Id' })
  userId: number;

  @ManyToOne(() => PaymentEntity, (payment) => payment.id)
  @Column({ name: 'payment_id' })
  @ApiProperty({ description: 'Payment Id' })
  paymentId: number;

  @Column({ type: 'decimal', default: 0 })
  @ApiProperty({ description: 'Order`s Total Price' })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Created Datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Updated Datetime' })
  updatedAt: Date;
}
