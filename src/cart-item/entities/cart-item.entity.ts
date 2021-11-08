import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ProductEntity } from '@root/product/entities/product.entity';
import { CartEntity } from '@root/cart/entities/cart.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cart-item')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Cart Item Id' })
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @Column({ name: 'product_id' })
  @ApiProperty({ description: 'Product Id' })
  productId: number;

  @ManyToOne(() => CartEntity, (cart) => cart.id)
  @Column({ name: 'cart_id' })
  @ApiProperty({ description: 'Cart Id' })
  cartId: number;

  @Column()
  @ApiProperty({ description: 'Cart Item Quantity' })
  quantity: number;

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
