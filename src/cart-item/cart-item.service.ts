import {
  Injectable,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { CartService } from '@root/cart/cart.service';
import { ProductService } from '@root/product/product.service';
import { validate } from 'class-validator';
import { CartItemRepository } from './cart-item.repository';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartItemNotFoundError } from './exceptions/cart-item-not-found.exception';
import { ProductQuantityLackError } from './exceptions/product-quantity-lack.exception';
import { ProductAlreadyExistsInCartError } from './exceptions/product-already-exists-in-cart.exception';

@Injectable()
export class CartItemService {
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async create(userId: number, createCartItemDto: CreateCartItemDto) {
    const validation_error = await validate(createCartItemDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { productId, quantity } = createCartItemDto;

    const thisCart = await this.cartService.findOneByUserId(userId);

    const thisProduct = await this.cartItemRepository.findOne({
      where: { productId: productId, cartId: thisCart.id },
    });

    if (thisProduct) {
      throw new ProductAlreadyExistsInCartError();
    }

    await this.checkProductQuantity(productId, quantity);

    const cartId = thisCart.id;
    const newCartItem = new CartItemEntity();
    newCartItem.cartId = cartId;
    newCartItem.productId = productId;
    newCartItem.quantity = quantity;

    const result = await this.cartItemRepository.save(newCartItem);

    await this.calculateTotalPrice(cartId);

    return result;
  }

  async findAll(userId: number) {
    const thisCart = await this.cartService.findOneByUserId(userId);
    await this.calculateTotalPrice(thisCart.id);
    const cartItems = await this.cartItemRepository.find({
      cartId: thisCart.id,
    });

    for (const cartItem of cartItems) {
      await this.checkProductQuantity(cartItem.productId, cartItem.quantity);
    }

    const result = { cartItems: cartItems, ...thisCart };
    return result;
  }

  async findOne(userId: number, id: number) {
    const result = await this.cartItemRepository.findOne({ id: id });

    if (!result) {
      throw new CartItemNotFoundError();
    }

    const thisCart = await this.cartService.findOneByUserId(userId);

    if (thisCart.id !== result.cartId) {
      throw new UnauthorizedException();
    }

    return result;
  }

  async update(
    userId: number,
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const validation_error = await validate(updateCartItemDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { quantity } = updateCartItemDto;

    const thisCartItem = await this.findOne(userId, id);

    await this.checkProductQuantity(thisCartItem.productId, quantity);

    await this.cartItemRepository.update(id, {
      quantity: quantity,
    });

    await this.calculateTotalPrice(thisCartItem.cartId);

    const result = await this.findOne(userId, id);

    return result;
  }

  async remove(userId: number, id: number) {
    const thisCartItem = await this.findOne(userId, id);
    const result = await this.cartItemRepository.softRemove(thisCartItem);

    return result;
  }

  async calculateTotalPrice(cartId: number) {
    let totalPrice = 0;
    const cartItems: CartItemEntity[] = await this.cartItemRepository.find({
      cartId: cartId,
    });

    for (const cartItem of cartItems) {
      const thisProduct = await this.productService.findOne(cartItem.productId);
      totalPrice += thisProduct.price * cartItem.quantity;
    }

    const result = await this.cartService.update(cartId, { total: totalPrice });

    return result;
  }

  async checkProductQuantity(productId: number, quantity: number) {
    const thisProduct = await this.productService.findOne(productId);

    if (thisProduct.quantity < quantity) {
      throw new ProductQuantityLackError(
        `ProductId ${productId} has ${thisProduct.quantity} items. claimed ${quantity} items`,
      );
    }

    return thisProduct;
  }
}
