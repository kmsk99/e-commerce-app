import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PurchaseOneDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Purchase Quantity' })
  readonly quantity: number;
}
