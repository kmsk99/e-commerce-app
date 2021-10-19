import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './../src/users/entities/user.entity';
import { UsersModule } from './../src/users/users.module';
import { Connection } from 'typeorm';
import { CartModule } from './../src/cart/cart.module';
import { ProductModule } from './../src/product/product.module';
import { CartItemModule } from './../src/cart-item/cart-item.module';
import { OrderModule } from './../src/order/order.module';
import { OrderItemsModule } from '../src/order-item/order-item.module';
import { PaymentModule } from './../src/payment/payment.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        CartModule,
        ProductModule,
        CartItemModule,
        OrderModule,
        OrderItemsModule,
        PaymentModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'e2e_test',
          entities: [UserEntity],
          logging: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.useLogger(new TestLogger()) // more on this line is below
    await app.init();

    const connection = app.get(Connection);
    await connection.synchronize(true);
  });

  describe('/users', () => {
    describe('/register', () => {
      describe('POST', () => {
        it('register succes', () => {
          return request(app.getHttpServer())
            .post('/users/register')
            .send({
              username: 'username',
              email: 'abc@naver.com',
              password: '12345678',
            })
            .expect(201);
        });

        it('email_already_exists_exception', () => {
          return request(app.getHttpServer())
            .post('/users/register')
            .send({
              username: 'username1',
              email: 'abc@naver.com',
              password: '12345678',
            })
            .expect(400)
            .expect({
              statusCode: 400,
              message: 'email already exist',
              error: 'Email is already exists',
            });
        });

        it('username_already_exists_exception', () => {
          return request(app.getHttpServer())
            .post('/users/register')
            .send({
              username: 'username',
              email: 'abcd@naver.com',
              password: '12345678',
            })
            .expect(400)
            .expect({
              statusCode: 400,
              message: 'username already exist',
              error: 'UserName is already exists',
            });
        });
      });
    });

    describe('/login', () => {
      it.todo('POST');
    });
  });

  describe('/products', () => {
    describe('?cartegody={categotyID}', () => {
      it.todo('GET');
    });
  });

  describe('/{productId}', () => {
    it.todo('GET');
  });

  describe('/users', () => {
    it.todo('GET');
    describe('/{userId}', () => {
      it.todo('GET');
      it.todo('GET');
    });
  });

  describe('/cart', () => {
    it.todo('POST');
    describe('/{cartId}', () => {
      it.todo('POST');
      it.todo('GET');
    });
  });

  describe('/cart/{cartId}/checkout', () => {
    it.todo('POST');
  });

  describe('/orders', () => {
    it.todo('GET');
    describe('/{orderId}', () => {
      it.todo('GET');
    });
  });
});
