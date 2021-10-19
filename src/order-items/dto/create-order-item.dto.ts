import { IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  readonly orderId: number;

  @IsNotEmpty()
  readonly productId: number;

  @IsNotEmpty()
  readonly quantity: number;
}
