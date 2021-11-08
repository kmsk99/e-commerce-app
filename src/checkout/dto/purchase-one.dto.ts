import { IsNotEmpty } from 'class-validator';

export class PurchaseOneDto {
  @IsNotEmpty()
  readonly quantity: number;
}
