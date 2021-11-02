import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Request() req) {
    return this.cartService.findOneByUserId(req.user.id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartService.remove(+id);
  // }

  // @Post()
  // create(@Body() createCartDto: CreateCartDto) {
  //   return this.cartService.create(createCartDto);
  // }

  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }
}
