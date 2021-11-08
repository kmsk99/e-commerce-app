import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpError4xxDto, CartAndCartItemsDto } from '../app.dto';

@Controller('cart')
@ApiTags('Cart Api')
@ApiBadRequestResponse({
  description: 'No required argument',
  type: HttpError4xxDto,
})
@ApiUnauthorizedResponse({
  description: 'Authentication failure',
  type: HttpError4xxDto,
})
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create Cart Item Api',
    description: 'Create Cart Item',
  })
  create(@Request() req, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(req.user.id, createCartItemDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Find All Cart Items Api',
    description: 'Find All Cart Items',
  })
  @ApiOkResponse({
    description: 'Find All Cart Items',
    type: CartAndCartItemsDto,
  })
  findAll(@Request() req) {
    return this.cartItemService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Find Cart Item Api',
    description: 'Find Cart Item',
  })
  findOne(@Request() req, @Param('id') id: string) {
    return this.cartItemService.findOne(req.user.id, +id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update Cart Item Api',
    description: 'Update Cart Item',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(req.user.id, +id, updateCartItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Remove Cart Item Api',
    description: 'Remove Cart Item',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.cartItemService.remove(req.user.id, +id);
  }
}
