import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  create(userId: number, createPaymentDto: CreatePaymentDto) {
    return new Promise(() => {
      return '';
    });
  }

  findAll(userId: number) {
    return new Promise(() => {
      return '';
    });
  }

  findOne(userId: number) {
    return new Promise(() => {
      return '';
    });
  }

  update(userId: number, updatePaymentDto: UpdatePaymentDto) {
    return new Promise(() => {
      return '';
    });
  }

  remove(userId: number) {
    return new Promise(() => {
      return '';
    });
  }
}
