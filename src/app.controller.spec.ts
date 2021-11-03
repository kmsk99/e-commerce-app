import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import * as faker from 'faker';

describe('AppController', () => {
  let appController: AppController;
  let userService: UserService;
  let authService: AuthService;

  const randomUsername = faker.internet.userName();
  const userId = faker.datatype.number();

  const randomJwtToken = { token: 'abcdefghijklmnopqrstuvwxyz' };

  const foundUser = {
    id: userId,
    username: randomUsername,
    email: faker.internet.email(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  const request = {
    user: { username: randomUsername, id: userId },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AuthService, useValue: { login: jest.fn() } },
        {
          provide: UserService,
          useValue: { findOne: jest.fn(), findByUserId: jest.fn() },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    userService = app.get<UserService>(UserService);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
    expect(userService).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('login', async () => {
    const authServiceLoginSpy = jest
      .spyOn(authService, 'login')
      .mockResolvedValue(randomJwtToken);

    const result = await appController.login(request);

    expect(authServiceLoginSpy).toBeCalledWith(request.user);
    expect(authServiceLoginSpy).toBeCalledTimes(1);
    expect(result).toBe(randomJwtToken);
  });

  it('users', async () => {
    const UserServiceFindOneSpy = jest
      .spyOn(userService, 'findOne')
      .mockResolvedValue(foundUser);

    const result = await appController.getUser(request);

    expect(UserServiceFindOneSpy).toBeCalledWith(randomUsername);
    expect(UserServiceFindOneSpy).toBeCalledTimes(1);
    expect(result).toBe(foundUser);
  });

  it('users/:userId', async () => {
    const UserServiceFindByUserIdSpy = jest
      .spyOn(userService, 'findByUserId')
      .mockResolvedValue(foundUser);

    const result = await appController.getUserId(userId);

    expect(UserServiceFindByUserIdSpy).toBeCalledWith(userId);
    expect(UserServiceFindByUserIdSpy).toBeCalledTimes(1);
    expect(result).toBe(foundUser);
  });
});
