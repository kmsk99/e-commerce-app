import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OrderService } from '@root/order/order.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { validate } from 'class-validator';
import { OrderItemRepository } from './order-item.repository';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemNotFoundError } from './exceptions/order-item-not-found.exception';
import { ProductService } from '@root/product/product.service';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly productService: ProductService,
  ) {}

  async create(userId: number, createOrderItemDto: CreateOrderItemDto) {
    const validation_error = await validate(createOrderItemDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { orderId, productId, quantity } = createOrderItemDto;

    await this.orderService.findOne(userId, orderId);
    await this.productService.sold(productId, quantity);

    const newOrderItem = new OrderItemEntity();
    newOrderItem.orderId = orderId;
    newOrderItem.productId = productId;
    newOrderItem.quantity = quantity;

    const result = await this.orderItemRepository.save(newOrderItem);

    return result;
  }

  async findAll(userId: number, orderId: number) {
    const thisOrder = await this.orderService.findOne(userId, orderId);

    const thisOrderItems = await this.orderItemRepository.find({
      where: { orderId: orderId },
    });

    const result = { orderItems: thisOrderItems, ...thisOrder };

    return result;
  }

  async findOne(userId: number, orderItemId: number) {
    const result = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
    });

    if (!result) {
      throw new OrderItemNotFoundError();
    }

    await this.orderService.findOne(userId, result.orderId);

    return result;
  }
}
