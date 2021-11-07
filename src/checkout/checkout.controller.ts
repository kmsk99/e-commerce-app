import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@root/auth/guards/jwt-auth.guard';
import { CheckoutService } from './checkout.service';
import { PurchaseOneDto } from './dto/purchase-one.dto';

@Controller('')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post('cart/checkout')
  purchaseCart(@Request() req, @Body() password: string) {
    return this.checkoutService.purchaseCart(
      req.user.id,
      req.user.username,
      password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('products/:id/checkout')
  purchaseOne(
    @Request() req,
    @Param('id') id: string,
    @Body() purchaseOneDto: PurchaseOneDto,
  ) {
    return this.checkoutService.purchaseOne(
      req.user.id,
      req.user.username,
      +id,
      purchaseOneDto.password,
      purchaseOneDto.quantity,
    );
  }
}
