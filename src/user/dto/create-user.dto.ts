import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 32)
  @ApiProperty({ description: 'Username' })
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Password' })
  readonly password: string;
}
