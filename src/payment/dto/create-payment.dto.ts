import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  readonly provider: string;

  @IsNotEmpty()
  readonly status: string;
}
