import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../../category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Product Id' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Product Name' })
  name: string;

  @Column({ type: 'decimal' })
  @ApiProperty({ description: 'Product Price' })
  price: number;

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @Column({ name: 'category_id' })
  @ApiProperty({ description: 'Category Id' })
  categoryId: number;

  @Column()
  @ApiProperty({ description: 'Product Quantity' })
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
