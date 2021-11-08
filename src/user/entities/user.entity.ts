import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'User Id' })
  id: number;

  @Column({ unique: true, length: 32 })
  @ApiProperty({ description: 'Username' })
  username: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Email' })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Created Datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Updated Datetime' })
  updatedAt: Date;

  @Column()
  @ApiProperty({ description: 'Password' })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
