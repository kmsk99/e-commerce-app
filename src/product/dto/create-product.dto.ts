import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly categoryId: number;

  @IsNotEmpty()
  @IsDecimal()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
}
