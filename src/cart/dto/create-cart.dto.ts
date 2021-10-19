import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  readonly userId: number;

  @IsNotEmpty()
  readonly total: number;
}
