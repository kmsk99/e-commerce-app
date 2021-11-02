import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { AppModule } from '@root/app.module';
import * as faker from 'faker';
import { isJWT } from 'class-validator';

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

    describe('/users', () => {
      describe('GET', () => {
        it('users success', () => {
          return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${userAToken}`)
            .expect((response: request.Response) => {
              expect(response.body.username).toBe(userA.username);
              expect(response.body.email).toBe(userA.email);
            })
            .expect(200);
        });

        it('Unauthorized', () => {
          return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${'randomjwt'}`)
            .expect({
              statusCode: 401,
              message: 'Unauthorized',
            });
        });
      });
      describe('/{userId}', () => {
        describe('GET', () => {
          it('userId 1 return', () => {
            return request(app.getHttpServer())
              .get('/users/1')
              .set('Authorization', `Bearer ${userAToken}`)
              .expect((response: request.Response) => {
                expect(response.body.username).toBe(userA.username);
                expect(response.body.email).toBe(userA.email);
              })
              .expect(200);
          });

          it('not exist userId', () => {
            return request(app.getHttpServer())
              .get('/users/2')
              .set('Authorization', `Bearer ${userAToken}`)
              .expect({
                statusCode: 400,
                message: 'user not found',
                error: 'Bad Request',
              });
          });
        });
      });
    });
  });

  describe('/category', () => {
    const categoryA = { name: 'Toy' };
    const categoryB = { name: 'Food' };
    const categoryC = { name: 'Berverage' };
    const categoryD = { name: 'Kitchen' };

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
          await request(app.getHttpServer()).delete('/category/3');
          return await request(app.getHttpServer()).get('/category/3').expect({
            statusCode: 400,
            message: 'category not found',
            error: 'Bad Request',
          });
        });

        it('category not found', () => {
          return request(app.getHttpServer()).delete('/category/3').expect({
            statusCode: 400,
            message: 'category not found',
            error: 'Bad Request',
          });
        });
      });
    });
  });

  describe('/products', () => {
    const productA = {
      name: faker.commerce.product(),
      categoryId: 1,
      price: faker.commerce.price(),
      quantity: faker.datatype.number(),
    };

    const productB = {
      name: faker.commerce.product(),
      categoryId: 2,
      price: faker.commerce.price(),
      quantity: faker.datatype.number(),
    };

    const productC = {
      name: faker.commerce.product(),
      categoryId: 2,
      price: faker.commerce.price(),
      quantity: faker.datatype.number(),
    };

    const productNotExistCategoryId = {
      name: faker.commerce.product(),
      categoryId: 3,
      price: faker.commerce.price(),
      quantity: faker.datatype.number(),
    };

    describe('POST', () => {
      it('success productA', () => {
        return request(app.getHttpServer())
          .post('/products')
          .send(productA)
          .expect(201);
      });

      it('success productB', () => {
        return request(app.getHttpServer())
          .post('/products')
          .send(productB)
          .expect(201);
      });

      it('success productC', () => {
        return request(app.getHttpServer())
          .post('/products')
          .send(productC)
          .expect(201);
      });

      it('category not found', () => {
        return request(app.getHttpServer())
          .post('/products')
          .send(productNotExistCategoryId)
          .expect({
            statusCode: 400,
            message: 'category not found',
            error: 'Bad Request',
          });
      });
    });

    describe('GET', () => {
      it('success', () => {
        return request(app.getHttpServer())
          .get('/products')
          .expect(200)
          .expect((respone) => {
            const result = respone.body;
            expect(result.length).toBe(3);
          });
      });
    });

    describe('/:id', () => {
      describe('GET', () => {
        it('success', () => {
          return request(app.getHttpServer())
            .get('/products/1')
            .expect(200)
            .expect((respone) => {
              const result = respone.body;
              expect(result).toHaveProperty('name', productA.name);
              expect(result).toHaveProperty('id', productA.categoryId);
              expect(result).toHaveProperty('price', productA.price);
              expect(result).toHaveProperty('quantity', productA.quantity);
            });
        });

        it('product not found', () => {
          return request(app.getHttpServer()).get('/products/4').expect({
            statusCode: 400,
            message: 'product not found',
            error: 'Bad Request',
          });
        });
      });

      describe('PATCH', () => {
        it('success', () => {
          return request(app.getHttpServer())
            .patch('/products/3')
            .send(productA)
            .expect(200)
            .expect((respone) => {
              const result = respone.body;
              expect(result).toHaveProperty('name', productA.name);
              expect(result).toHaveProperty('categoryId', productA.categoryId);
              expect(result).toHaveProperty('price', productA.price);
              expect(result).toHaveProperty('quantity', productA.quantity);
            });
        });

        it('product not found', () => {
          return request(app.getHttpServer())
            .patch('/products/4')
            .send(productA)
            .expect({
              statusCode: 400,
              message: 'product not found',
              error: 'Bad Request',
            });
        });

        it('category not found', () => {
          return request(app.getHttpServer())
            .patch('/products/1')
            .send(productNotExistCategoryId)
            .expect({
              statusCode: 400,
              message: 'category not found',
              error: 'Bad Request',
            });
        });
      });

      describe('DELETE', () => {
        it('success', () => {
          return request(app.getHttpServer()).delete('/products/3').expect(200);
        });

        it('product not found', () => {
          return request(app.getHttpServer()).delete('/products/4').expect({
            statusCode: 400,
            message: 'product not found',
            error: 'Bad Request',
          });
        });
      });
    });

    describe('/search?category={categoryId}', () => {
      describe('GET', () => {
        it('category 1 return success', () => {
          return request(app.getHttpServer())
            .get('/products/search?category=1')
            .expect(200)
            .expect((respone) => {
              const result = respone.body;
              expect(result.length).toBe(1);
              expect(result[0]).toHaveProperty('name', productA.name);
              expect(result[0]).toHaveProperty(
                'categoryId',
                productA.categoryId,
              );
              expect(result[0]).toHaveProperty('price', productA.price);
              expect(result[0]).toHaveProperty('quantity', productA.quantity);
            });
        });
        it('category 2 return success', () => {
          return request(app.getHttpServer())
            .get('/products/search?category=2')
            .expect(200)
            .expect((respone) => {
              const result = respone.body;
              expect(result.length).toBe(1);
              expect(result[0]).toHaveProperty('name', productB.name);
              expect(result[0]).toHaveProperty(
                'categoryId',
                productB.categoryId,
              );
              expect(result[0]).toHaveProperty('price', productB.price);
              expect(result[0]).toHaveProperty('quantity', productB.quantity);
            });
        });
        it('category 3 not found', () => {
          return request(app.getHttpServer())
            .get('/products/search?category=3')
            .expect({
              statusCode: 400,
              message: 'category not found',
              error: 'Bad Request',
            });
        });
      });
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
