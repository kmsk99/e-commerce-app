import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  readonly userId: number;

  @IsNotEmpty()
  readonly paymentId: number;

  @IsNotEmpty()
  readonly total: number;
}
