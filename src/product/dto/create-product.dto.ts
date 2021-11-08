import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Product Name' })
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Category Id' })
  readonly categoryId: number;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty({ description: 'Product Price' })
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Product Quantity' })
  readonly quantity: number;
}
