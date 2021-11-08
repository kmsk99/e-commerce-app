import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpError4xxDto } from '@root/app.dto';

@Controller('order')
@ApiTags('Order Api')
@ApiBadRequestResponse({
  description: 'No required argument',
  type: HttpError4xxDto,
})
@ApiUnauthorizedResponse({
  description: 'Authentication failure',
  type: HttpError4xxDto,
})
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Find Order Item Api',
    description: 'Find Order Item',
  })
  findAll(@Request() req, @Param('orderId') orderId: string) {
    return this.orderItemService.findAll(req.user.id, +orderId);
  }
}
