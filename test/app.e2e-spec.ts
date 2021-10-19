import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './../src/users/entities/user.entity';
import { UsersModule } from './../src/users/users.module';
import { Connection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
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
      it('POST', () => {
        return request(app.getHttpServer())
          .post('/users/register')
          .send({
            username: 'username',
            email: '01012345678',
            password: '12345678',
          })
          .expect(201);
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
