import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Product Id' })
  readonly productId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Cart Item Quantity' })
  readonly quantity: number;
}
