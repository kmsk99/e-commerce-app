import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('order')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  findAll(@Request() req, @Param('orderId') orderId: string) {
    return this.orderItemService.findAll(req.user.id, +orderId);
  }
}
