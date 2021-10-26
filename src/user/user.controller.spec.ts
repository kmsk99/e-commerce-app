import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as faker from 'faker';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const userId = faker.datatype.number();
  const randomDate = faker.date.recent();
  const randomUsername = faker.internet.userName();
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password();

  const createUserDto: CreateUserDto = {
    username: randomUsername,
    email: randomEmail,
    password: randomPassword,
  };

  const savedUser = {
    id: userId,
    createdAt: randomDate,
    updatedAt: randomDate,
    username: randomUsername,
    email: randomEmail,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('/register', () => {
    it('POST', async () => {
      const userServiceCreateSpy = jest
        .spyOn(userService, 'create')
        .mockResolvedValue(savedUser);

      const result = await userController.create(createUserDto);

      expect(userServiceCreateSpy).toHaveBeenCalledWith(createUserDto);
      expect(userServiceCreateSpy).toBeCalledTimes(1);
      expect(result).toBe(savedUser);
    });
  });
});
