import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCartItemDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Cart Item Quantity' })
  readonly quantity: number;
}
