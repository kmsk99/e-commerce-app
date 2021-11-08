import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Order Id' })
  readonly orderId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Product Id' })
  readonly productId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Order Item Quantity' })
  readonly quantity: number;
}
