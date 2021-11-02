import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '@root/user/user.service';
import { validate } from 'class-validator';
import { CartRepository } from './cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartEntity } from './entities/cart.entity';
import { CartNotFoundError } from './exceptions/cart-not-found.exception';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly userService: UserService,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const validation_error = await validate(createCartDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { userId } = createCartDto;

    await this.userService.findByUserId(userId);

    const newCart = new CartEntity();
    newCart.userId = userId;

    const result = await this.cartRepository.save(newCart);

    return result;
  }

  async findOne(id: number) {
    const result = await this.cartRepository.findOne({ where: { id: id } });

    if (!result) {
      throw new CartNotFoundError();
    }

    return result;
  }

  async findOneByUserId(userId: number) {
    let result = await this.cartRepository.findOne({
      where: { userId: userId },
    });

    if (!result) {
      result = await this.create({ userId: userId });
    }

    return result;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    await this.findOne(id);

    const result = await this.cartRepository.update(id, updateCartDto);

    return result;
  }

  async remove(id: number) {
    const thisProduct = await this.findOne(id);
    const result = await this.cartRepository.softRemove(thisProduct);

    return result;
  }
}
