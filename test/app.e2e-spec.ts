import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { AppModule } from '@root/app.module';
import * as faker from 'faker';
import { isJWT, IS_JWT } from 'class-validator';
import { response } from 'express';
import { CategoryEntity } from '../src/category/entities/category.entity';

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

  describe('/category', () => {
    const categoryA = { name: faker.commerce.productAdjective() };
    const categoryB = { name: faker.commerce.productAdjective() };
    const categoryC = { name: faker.commerce.productAdjective() };
    const categoryD = { name: faker.commerce.productAdjective() };

    describe('POST', () => {
      it('success categoryA', () => {
        return request(app.getHttpServer())
          .post('/category')
          .send(categoryA)
          .expect(201);
      });

      it('success categoryB', () => {
        return request(app.getHttpServer())
          .post('/category')
          .send(categoryB)
          .expect(201);
      });

      it('success categoryC', () => {
        return request(app.getHttpServer())
          .post('/category')
          .send(categoryC)
          .expect(201);
      });

      it('not valid name', () => {
        return request(app.getHttpServer())
          .post('/category')
          .send({ name: '' })
          .expect({
            statusCode: 400,
            message: ['name should not be empty'],
            error: 'Bad Request',
          });
      });

      it('category name already exists', () => {
        return request(app.getHttpServer())
          .post('/category')
          .send(categoryA)
          .expect({
            statusCode: 400,
            message: 'category name already exist',
            error: 'Bad Request',
          });
      });
    });

    describe('GET', () => {
      it('success', () => {
        return request(app.getHttpServer())
          .get('/category')
          .expect(200)
          .expect((response) => {
            const result = response.body.map((category) => category.id);
            expect(result).toStrictEqual([1, 2, 3]);
          });
      });
    });

    describe('/:id', () => {
      describe('GET', () => {
        it('success id 1', () => {
          return request(app.getHttpServer())
            .get('/category/1')
            .expect(200)
            .expect((response) => {
              const result = response.body;
              expect(result).toHaveProperty('id', 1);
              expect(result).toHaveProperty('name', categoryA.name);
            });
        });

        it('success id 2', () => {
          return request(app.getHttpServer())
            .get('/category/2')
            .expect(200)
            .expect((response) => {
              const result = response.body;
              expect(result).toHaveProperty('id', 2);
              expect(result).toHaveProperty('name', categoryB.name);
            });
        });

        it('category not found', () => {
          return request(app.getHttpServer()).get('/category/4').expect({
            statusCode: 400,
            message: 'category not found',
            error: 'Bad Request',
          });
        });
      });

      describe('PATCH', () => {
        it('category A changed', () => {
          return request(app.getHttpServer())
            .patch('/category/1')
            .send(categoryD)
            .expect((response) => {
              const result = response.body;
              expect(result).toHaveProperty('id', 1);
              expect(result).toHaveProperty('name', categoryD.name);
            });
        });

        it('category name already exists', () => {
          return request(app.getHttpServer())
            .patch('/category/2')
            .send(categoryD)
            .expect({
              statusCode: 400,
              message: 'category name already exist',
              error: 'Bad Request',
            });
        });

        it('category not found', () => {
          return request(app.getHttpServer())
            .patch('/category/4')
            .send(categoryD)
            .expect({
              statusCode: 400,
              message: 'category not found',
              error: 'Bad Request',
            });
        });
      });

      describe('DELETE', () => {
        it('success', async () => {
          await request(app.getHttpServer()).delete('/category/1');
          return await request(app.getHttpServer()).get('/category/1').expect({
            statusCode: 400,
            message: 'category not found',
            error: 'Bad Request',
          });
        });

        it('category not found', () => {
          return request(app.getHttpServer()).delete('/category/1').expect({
            statusCode: 400,
            message: 'category not found',
            error: 'Bad Request',
          });
        });
      });
    });
  });

  describe('/products', () => {
    it.todo('POST');
    it.todo('GET');
    describe('/:id', () => {
      it.todo('GET');
      it.todo('PATCH');
      it.todo('DELETE');
    });
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
