import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { validate } from 'class-validator';
import { UserService } from '../user/user.service';
import { PaymentAlreadyExistsException } from './exceptions/payment-already-exists.exception';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentNotFoundError } from './exceptions/pament-not-found.exception';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, createPaymentDto: CreatePaymentDto) {
    const validation_error = await validate(createPaymentDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { provider } = createPaymentDto;

    const thisPayment = await this.paymentRepository.findOne({
      where: { userId: userId },
    });

    if (thisPayment) {
      throw new PaymentAlreadyExistsException();
    }

    const newPayment = new PaymentEntity();
    newPayment.userId = userId;
    newPayment.provider = provider;
    newPayment.status = true;

    const result = await this.paymentRepository.save(newPayment);

    return result;
  }

  async findOne(userId: number) {
    const result = await this.paymentRepository.findOne({
      where: { userId: userId },
    });

    if (!result) {
      throw new PaymentNotFoundError();
    }

    return result;
  }

  async update(userId: number, updatePaymentDto: UpdatePaymentDto) {
    const validation_error = await validate(updatePaymentDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { provider } = updatePaymentDto;

    const thisPayment = await this.findOne(userId);

    await this.paymentRepository.update(thisPayment.id, {
      provider: provider,
    });

    const result = await this.findOne(userId);

    return result;
  }

  async remove(userId: number) {
    const thisPayment = await this.findOne(userId);
    const result = await this.paymentRepository.softRemove(thisPayment);

    return result;
  }
}
