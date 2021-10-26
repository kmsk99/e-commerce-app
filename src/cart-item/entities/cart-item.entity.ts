import { ProductEntity } from '@root/product/entities/product.entity';
import { UserEntity } from '@root/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('cart-item')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  userId: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
