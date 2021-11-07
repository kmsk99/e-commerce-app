import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { validate } from 'class-validator';
import { OrderRepository } from './order.repository';
import { UserService } from '@root/user/user.service';
import { PaymentService } from '@root/payment/payment.service';
import { OrderEntity } from './entities/order.entity';
import { OrderNotFoundError } from './exceptions/order-not-found.exception';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const validation_error = await validate(createOrderDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { total } = createOrderDto;

    await this.userService.findByUserId(userId);
    const paymentId = await this.paymentService.findOne(userId);

    const newOrder = new OrderEntity();
    newOrder.userId = userId;
    newOrder.paymentId = paymentId.id;
    newOrder.total = total;

    const result = await this.orderRepository.save(newOrder);

    return result;
  }

  async findAll(userId: number) {
    const result = await this.orderRepository.find({
      where: { userId: userId },
    });

    return result;
  }

  async findOne(userId: number, id: number) {
    const result = await this.orderRepository.findOne({ where: { id: id } });

    if (!result) {
      throw new OrderNotFoundError();
    }

    if (result.userId !== userId) {
      throw new UnauthorizedException();
    }

    return result;
  }
}
