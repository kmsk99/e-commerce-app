import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Cart Id' })
  readonly userId: number;
}
