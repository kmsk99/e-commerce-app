import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { AppModule } from '@root/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.useLogger(new TestLogger()) // more on this line is below
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const connection = app.get(Connection);
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
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

        it('username too short', () => {
          return request(app.getHttpServer())
            .post('/users/register')
            .send({
              username: 'abc',
              email: 'abcd@naver.com',
              password: '12345678',
            })
            .expect(400)
            .expect({
              statusCode: 400,
              message: [
                'username must be longer than or equal to 4 characters',
              ],
              error: 'Bad Request',
            });
        });

        it('username too long', () => {
          return request(app.getHttpServer())
            .post('/users/register')
            .send({
              username: '123456789012345678901234567890123',
              email: 'abcd@naver.com',
              password: '12345678',
            })
            .expect(400)
            .expect({
              statusCode: 400,
              message: [
                'username must be shorter than or equal to 32 characters',
              ],
              error: 'Bad Request',
            });
        });

        it('email is not valid', () => {
          return request(app.getHttpServer())
            .post('/users/register')
            .send({
              username: 'abcd',
              email: 'abcd@com',
              password: '12345678',
            })
            .expect(400)
            .expect({
              statusCode: 400,
              message: ['email must be an email'],
              error: 'Bad Request',
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

  describe('/order', () => {
    it.todo('GET');
    describe('/{orderId}', () => {
      it.todo('GET');
    });
  });
});
