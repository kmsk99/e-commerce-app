import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

describe('AppController', () => {
  let appController: AppController;
  let userService: UserService;
  let authService: AuthService;

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
});
