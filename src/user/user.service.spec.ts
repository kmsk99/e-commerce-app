import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import * as faker from 'faker';
import { CreateUserDto } from './dto/create-user.dto';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exist-exception';
import { EmailAlreadyExistsException } from './exceptions/email-already-exist-exception';
import { UserNotFoundException } from './exceptions/user-not-found-exception';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

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
    username: randomUsername,
    email: randomEmail,
    password: randomPassword,
    id: userId,
    createdAt: randomDate,
    updatedAt: randomDate,
    hashPassword() {
      return null;
    },
  };

  const fileteredUser = {
    username: randomUsername,
    email: randomEmail,
    id: userId,
    createdAt: randomDate,
    updatedAt: randomDate,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('Successfully create', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(undefined);

      const userRepositorySaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(savedUser);

      const result = await userService.create(createUserDto);

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        username: randomUsername,
      });
      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        email: randomEmail,
      });
      expect(userRepositoryFindOneSpy).toBeCalledTimes(2);
      expect(userRepositorySaveSpy).toBeCalledTimes(1);
      expect(result).toStrictEqual(fileteredUser);
    });

    it('UserName is already exists', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(savedUser);

      try {
        await userService.create(createUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(UsernameAlreadyExistsException);
        expect(err.message).toBe('username already exist');
        expect(err.status).toBe(400);
      }

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        username: randomUsername,
      });
      expect(userRepositoryFindOneSpy).toBeCalledTimes(1);
    });

    it('Email is already exists', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValue(savedUser);

      try {
        await userService.create(createUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(EmailAlreadyExistsException);
        expect(err.message).toBe('email already exist');
        expect(err.status).toBe(400);
      }

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        username: randomUsername,
      });
      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        email: randomEmail,
      });
      expect(userRepositoryFindOneSpy).toBeCalledTimes(2);
    });
  });

  describe('findOne', () => {
    it('Username is not found', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await userService.findOne(randomUsername);
      } catch (err) {
        expect(err).toBeInstanceOf(UserNotFoundException);
        expect(err.message).toBe('user not found');
        expect(err.status).toBe(400);
      }

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        username: randomUsername,
      });
      expect(userRepositoryFindOneSpy).toBeCalledTimes(1);
    });
    it('Successfully findOne', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(savedUser);

      const result = await userService.findOne(randomUsername);

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        username: randomUsername,
      });
      expect(userRepositoryFindOneSpy).toBeCalledTimes(1);
      expect(result).toBe(savedUser);
    });
  });

  it('Password Filter', () => {
    const result = userService.passwordFilter(savedUser);

    expect(result).not.toHaveProperty('password');
  });
});
