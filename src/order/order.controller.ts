import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@root/auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.orderService.findAll(req.user.id);
  }
}
