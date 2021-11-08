import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order-item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Order Item Id' })
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @Column({ name: 'product_id' })
  @ApiProperty({ description: 'Product Id' })
  productId: number;

  @ManyToOne(() => OrderEntity, (order) => order.id)
  @Column({ name: 'order_id' })
  @ApiProperty({ description: 'Order Id' })
  orderId: number;

  @Column()
  @ApiProperty({ description: 'Order Item Quantity' })
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Created Datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Updated Datetime' })
  updatedAt: Date;
}
