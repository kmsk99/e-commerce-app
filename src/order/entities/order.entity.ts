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
  id: number;

  @ManyToOne(() => UserEntity, (users) => users.id)
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => PaymentEntity, (payment) => payment.id)
  @Column({ name: 'payment_id' })
  paymentId: number;

  @Column({ type: 'decimal', default: 0 })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
