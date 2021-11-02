import { IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  readonly total: number;
}
