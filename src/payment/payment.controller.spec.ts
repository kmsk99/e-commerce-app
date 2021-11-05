import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import * as faker from 'faker';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  const paymentId = faker.datatype.number();
  const userId = faker.datatype.number();
  const username = faker.internet.userName();
  const provider = faker.finance.creditCardNumber();
  const updatedProvider = faker.finance.creditCardNumber();
  const status = true;
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const updatedUpdatedAt = faker.date.recent();
  const deletedAt = faker.date.recent();

  const request = { user: { id: userId, username: username } };

  const createPaymentDto: CreatePaymentDto = {
    provider: provider,
  };

  const updatePaymentDto: UpdatePaymentDto = {
    provider: updatedProvider,
  };

  const savedPayment: PaymentEntity = {
    id: paymentId,
    userId: userId,
    provider: provider,
    status: status,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: undefined,
  };

  const updatedPayment: PaymentEntity = {
    id: paymentId,
    userId: userId,
    provider: updatedProvider,
    status: status,
    createdAt: createdAt,
    updatedAt: updatedUpdatedAt,
    deletedAt: undefined,
  };

  const deletedPayment: PaymentEntity = {
    id: paymentId,
    userId: userId,
    provider: provider,
    status: status,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: deletedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentController = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentController).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  describe('/cart', () => {
    it('POST', async () => {
      const paymentServiceCreateSpy = jest
        .spyOn(paymentService, 'create')
        .mockResolvedValue(savedPayment);

      const result = await paymentController.create(request, createPaymentDto);

      expect(paymentServiceCreateSpy).toHaveBeenCalledWith(
        userId,
        createPaymentDto,
      );
      expect(paymentServiceCreateSpy).toBeCalledTimes(1);
      expect(result).toBe(savedPayment);
    });

    it('GET', async () => {
      const paymentServiceFindOneSpy = jest
        .spyOn(paymentService, 'findOne')
        .mockResolvedValue(savedPayment);

      const result = await paymentController.findOne(request);

      expect(paymentServiceFindOneSpy).toHaveBeenCalledWith(userId);
      expect(paymentServiceFindOneSpy).toBeCalledTimes(1);
      expect(result).toBe(savedPayment);
    });

    it('PATCH', async () => {
      const paymentServiceUpdateSpy = jest
        .spyOn(paymentService, 'update')
        .mockResolvedValue(updatedPayment);

      const result = await paymentController.update(request, updatePaymentDto);

      expect(paymentServiceUpdateSpy).toHaveBeenCalledWith(
        userId,
        updatePaymentDto,
      );
      expect(paymentServiceUpdateSpy).toBeCalledTimes(1);
      expect(result).toBe(updatedPayment);
    });

    it('DELETE', async () => {
      const paymentServiceRemoveSpy = jest
        .spyOn(paymentService, 'remove')
        .mockResolvedValue(deletedPayment);

      const result = await paymentController.remove(request);

      expect(paymentServiceRemoveSpy).toHaveBeenCalledWith(userId);
      expect(paymentServiceRemoveSpy).toBeCalledTimes(1);
      expect(result).toBe(deletedPayment);
    });
  });
});
