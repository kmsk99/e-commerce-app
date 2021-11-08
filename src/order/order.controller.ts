import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@root/auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { HttpError4xxDto } from '../app.dto';

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
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Find All Orders Api',
    description: 'Find All Orders',
  })
  findAll(@Request() req) {
    return this.orderService.findAll(req.user.id);
  }
}
