import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Payment Provider' })
  readonly provider: string;
}
