import { ApiProperty } from '@nestjs/swagger';
import { CartItemEntity } from './cart-item/entities/cart-item.entity';
import { CartEntity } from './cart/entities/cart.entity';
import { OrderItemEntity } from './order-item/entities/order-item.entity';
import { OrderEntity } from './order/entities/order.entity';

export class HttpError4xxDto {
  @ApiProperty({ description: 'Message' })
  message: string;

  @ApiProperty({ description: 'Error' })
  error: string;

  @ApiProperty({ description: 'Status' })
  status: number;
}

export class tokenResponseDto {
  @ApiProperty({ description: 'JWTToken' })
  token: string;
}

export class userResponseDto {
  @ApiProperty({ description: 'UserId' })
  id: number;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Created Datetime' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated Datetime' })
  updatedAt: Date;
}

export class loginDto {
  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Password' })
  password: string;
}

export class OrderAndOrderItemsDto extends OrderEntity {
  @ApiProperty({ description: 'Order Items' })
  orderItems: OrderItemEntity[];
}

export class CartAndCartItemsDto extends CartEntity {
  @ApiProperty({ description: 'Order Items' })
  cartItems: CartItemEntity[];
}
