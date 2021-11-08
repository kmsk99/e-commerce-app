import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@root/auth/guards/jwt-auth.guard';
import { CheckoutService } from './checkout.service';
import { PurchaseOneDto } from './dto/purchase-one.dto';
import { HttpError4xxDto, OrderAndOrderItemsDto } from '../app.dto';

@Controller('')
@ApiTags('Checkout Api')
@ApiBadRequestResponse({
  description: 'No required argument',
  type: HttpError4xxDto,
})
@ApiUnauthorizedResponse({
  description: 'Authentication failure',
  type: HttpError4xxDto,
})
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('cart/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Purchase Cart Api', description: 'Purchase Cart' })
  @ApiCreatedResponse({
    description: 'Purchase Cart',
    type: OrderAndOrderItemsDto,
  })
  purchaseCart(@Request() req) {
    return this.checkoutService.purchaseCart(req.user.id);
  }

  @Post('products/:id/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Purchase Product Api',
    description: 'Purchase Product',
  })
  @ApiCreatedResponse({
    description: 'Purchase Product',
    type: OrderAndOrderItemsDto,
  })
  purchaseOne(
    @Request() req,
    @Param('id') id: string,
    @Body() purchaseOneDto: PurchaseOneDto,
  ) {
    return this.checkoutService.purchaseOne(
      req.user.id,
      +id,
      purchaseOneDto.quantity,
    );
  }
}
