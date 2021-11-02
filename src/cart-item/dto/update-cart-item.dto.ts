import { IsNotEmpty } from 'class-validator';

export class UpdateCartItemDto {
  @IsNotEmpty()
  readonly quantity: number;
}
