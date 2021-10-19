import { PaymentEntity } from 'src/payment/entities/payment.entity';
import {
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => PaymentEntity, (payment) => payment.id)
  @JoinColumn({ name: 'payment_id' })
  paymentId: number;

  @Column({ type: 'decimal' })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
