import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import * as faker from 'faker';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentRepository } from './payment.repository';
import { UserService } from '@root/user/user.service';
import { UpdateResult } from 'typeorm';
import { PaymentAlreadyExistsException } from './exceptions/payment-already-exists.exception';
import { PaymentNotFoundError } from './exceptions/pament-not-found.exception';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let paymentRepository: PaymentRepository;
  let userService: UserService;

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

  const updatePaymentResultSuccess: UpdateResult = {
    generatedMaps: [
      {
        id: paymentId,
        createdAt: createdAt,
        updatedAt: updatedUpdatedAt,
      },
    ],
    raw: [
      {
        id: paymentId,
        createdAt: createdAt,
        updatedAt: updatedAt,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        PaymentRepository,
        { provide: UserService, useValue: { findOneByUserId: jest.fn() } },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
    expect(paymentRepository).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('success', async () => {
      const PaymentRepositoryFindOneSpy = jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(undefined);

      const PaymentRepositorySaveSpy = jest
        .spyOn(paymentRepository, 'save')
        .mockResolvedValue(savedPayment);

      const result = await paymentService.create(userId, createPaymentDto);

      expect(PaymentRepositoryFindOneSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(PaymentRepositoryFindOneSpy).toBeCalledTimes(1);
      expect(PaymentRepositorySaveSpy).toBeCalledWith({
        userId: userId,
        provider: provider,
        status: true,
      });
      expect(PaymentRepositorySaveSpy).toBeCalledTimes(1);
      expect(result).toBe(savedPayment);
    });

    it('payment already exists', async () => {
      const PaymentRepositoryFindOneSpy = jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(savedPayment);

      try {
        await paymentService.create(userId, createPaymentDto);
      } catch (err) {
        expect(err).toBeInstanceOf(PaymentAlreadyExistsException);
        expect(err.message).toBe('payment already exists');
        expect(err.status).toBe(400);
      }

      expect(PaymentRepositoryFindOneSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(PaymentRepositoryFindOneSpy).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('success', async () => {
      const PaymentRepositoryFindOneSpy = jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(savedPayment);

      const result = await paymentService.findOne(userId);

      expect(PaymentRepositoryFindOneSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(PaymentRepositoryFindOneSpy).toBeCalledTimes(1);
      expect(result).toBe(savedPayment);
    });

    it('payment not found', async () => {
      const PaymentRepositoryFindOneSpy = jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await paymentService.findOne(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(PaymentNotFoundError);
        expect(err.message).toBe('payment not found');
        expect(err.status).toBe(400);
      }

      expect(PaymentRepositoryFindOneSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(PaymentRepositoryFindOneSpy).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('success', async () => {
      const PaymentRepositoryFindOneSpy = jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValueOnce(savedPayment)
        .mockResolvedValueOnce(updatedPayment);

      const PaymentRepositoryUpdateSpy = jest
        .spyOn(paymentRepository, 'update')
        .mockResolvedValue(updatePaymentResultSuccess);

      const result = await paymentService.update(userId, updatePaymentDto);

      expect(PaymentRepositoryFindOneSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(PaymentRepositoryFindOneSpy).toBeCalledTimes(2);
      expect(PaymentRepositoryUpdateSpy).toBeCalledWith(
        paymentId,
        updatePaymentDto,
      );
      expect(PaymentRepositoryUpdateSpy).toBeCalledTimes(1);
      expect(result).toBe(updatedPayment);
    });

    it('payment not found', async () => {
      const PaymentRepositoryFindOneSpy = jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await paymentService.update(userId, updatePaymentDto);
      } catch (err) {
        expect(err).toBeInstanceOf(PaymentNotFoundError);
        expect(err.message).toBe('payment not found');
        expect(err.status).toBe(400);
      }

      expect(PaymentRepositoryFindOneSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(PaymentRepositoryFindOneSpy).toBeCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('success', async () => {
      const PaymentRepositoryFindOneSpy = jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(savedPayment);

      const PaymentRepositorySoftRemoveSpy = jest
        .spyOn(paymentRepository, 'softRemove')
        .mockResolvedValue(deletedPayment);

      const result = await paymentService.remove(userId);

      expect(PaymentRepositoryFindOneSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(PaymentRepositoryFindOneSpy).toBeCalledTimes(1);
      expect(PaymentRepositorySoftRemoveSpy).toBeCalledWith(savedPayment);
      expect(PaymentRepositorySoftRemoveSpy).toBeCalledTimes(1);
      expect(result).toBe(deletedPayment);
    });

    it('payment not found', async () => {
      const PaymentRepositoryFindOneSpy = jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await paymentService.remove(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(PaymentNotFoundError);
        expect(err.message).toBe('payment not found');
        expect(err.status).toBe(400);
      }

      expect(PaymentRepositoryFindOneSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(PaymentRepositoryFindOneSpy).toBeCalledTimes(1);
    });
  });
});
