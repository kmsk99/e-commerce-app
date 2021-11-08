import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Category Id' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Category Name' })
  name: string;

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
