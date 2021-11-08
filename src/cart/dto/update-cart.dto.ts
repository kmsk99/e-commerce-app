import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Cart`s Total Price' })
  readonly total: number;
}
