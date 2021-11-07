import { IsNotEmpty } from 'class-validator';

export class PurchaseOneDto {
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly quantity: number;
}
