import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { AppModule } from '@root/app.module';
import * as faker from 'faker';
import { isJWT, IS_JWT } from 'class-validator';

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

  describe('user', () => {
    let userAToken: string;

    const userA = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const userB = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const userLongName = {
      username: '1'.repeat(33),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const userShortName = {
      username: '1'.repeat(3),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const userNotEmail = {
      username: faker.internet.userName(),
      email: 'not email',
      password: faker.internet.password(),
    };

    const userASameUsername = {
      username: userA.username,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const userASameEmail = {
      username: faker.internet.userName(),
      email: userA.email,
      password: faker.internet.password(),
    };

    describe('/register POST', () => {
      it('register succes', () => {
        return request(app.getHttpServer())
          .post('/register')
          .send(userA)
          .expect(201);
      });

      it('email_already_exists_exception', () => {
        return request(app.getHttpServer())
          .post('/register')
          .send(userASameEmail)
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'email already exist',
            error: 'Bad Request',
          });
      });

      it('username_already_exists_exception', () => {
        return request(app.getHttpServer())
          .post('/register')
          .send(userASameUsername)
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'username already exist',
            error: 'Bad Request',
          });
      });

      it('username too short', () => {
        return request(app.getHttpServer())
          .post('/register')
          .send(userShortName)
          .expect(400)
          .expect({
            statusCode: 400,
            message: ['username must be longer than or equal to 4 characters'],
            error: 'Bad Request',
          });
      });

      it('username too long', () => {
        return request(app.getHttpServer())
          .post('/register')
          .send(userLongName)
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
          .post('/register')
          .send(userNotEmail)
          .expect(400)
          .expect({
            statusCode: 400,
            message: ['email must be an email'],
            error: 'Bad Request',
          });
      });
    });

    describe('/login POST', () => {
      it('login success', () => {
        return request(app.getHttpServer())
          .post('/login')
          .send({ username: userA.username, password: userA.password })
          .expect(201)
          .expect((response: request.Response) => {
            const { token }: { token: string } = response.body;
            userAToken = token;
            expect(isJWT(token)).toBeTruthy();
          });
      });

      it('not exist username', () => {
        return request(app.getHttpServer())
          .post('/login')
          .send({ username: userB.username, password: userB.password })
          .expect(401)
          .expect((response: request.Response) => {
            const { token }: { token: string } = response.body;
            expect(token).toBeUndefined();
          });
      });

      it('not matching password', () => {
        return request(app.getHttpServer())
          .post('/login')
          .send({ username: userA.username, password: userB.password })
          .expect(401)
          .expect((response: request.Response) => {
            const { token }: { token: string } = response.body;
            expect(token).toBeUndefined();
          });
      });
    });

    describe('/profile GET', () => {
      it('profile success', () => {
        return request(app.getHttpServer())
          .get('/profile')
          .set('Authorization', `Bearer ${userAToken}`)
          .expect((response: request.Response) => {
            expect(response.body.username).toBe(userA.username);
          })
          .expect(200);
      });

      it('Unauthorized', () => {
        return request(app.getHttpServer())
          .get('/profile')
          .set('Authorization', `Bearer ${'randomjwt'}`)
          .expect({
            statusCode: 401,
            message: 'Unauthorized',
          });
      });
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
