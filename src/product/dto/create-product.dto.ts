import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly quantity: number;
}
