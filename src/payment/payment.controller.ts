import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(req.user.id, createPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Request() req) {
    return this.paymentService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Request() req, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(req.user.id, updatePaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Request() req) {
    return this.paymentService.remove(req.user.id);
  }
}
