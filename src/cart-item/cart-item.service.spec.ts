import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '@root/cart/cart.service';
import { ProductService } from '@root/product/product.service';
import { CartItemRepository } from './cart-item.repository';
import { CartItemService } from './cart-item.service';

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  let cartItemRepository: CartItemRepository;
  let cartService: CartService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        CartItemRepository,
        {
          provide: CartService,
          useValue: {},
        },
        {
          provide: ProductService,
          useValue: {},
        },
      ],
    }).compile();

    cartItemService = module.get<CartItemService>(CartItemService);
    cartItemRepository = module.get<CartItemRepository>(CartItemRepository);
    cartService = module.get<CartService>(CartService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(cartItemService).toBeDefined();
    expect(cartItemRepository).toBeDefined();
    expect(cartService).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('create', () => {
    it.todo('success');
    it.todo('cart not found');
    it.todo('product not found');
    it.todo('product quantity lack');
  });

  describe('findAll', () => {
    it.todo('success');
    it.todo('cart not found');
  });

  describe('findOne', () => {
    it.todo('success');
    it.todo('cart item not found');
  });

  describe('update', () => {
    it.todo('success');
    it.todo('cart item not found');
    it.todo('product not found');
    it.todo('product quantity lack');
  });

  describe('remove', () => {
    it.todo('success');
    it.todo('cart item not found');
  });

  describe('calculateTotalPrice', () => {
    it.todo('success');
    it.todo('cart not found');
  });

  describe('checkProductQuantity', () => {
    it.todo('success');
    it.todo('product not found');
    it.todo('product quantity lack');
  });
});
