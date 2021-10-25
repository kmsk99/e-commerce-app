import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import * as faker from 'faker';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { HttpException } from '@nestjs/common';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exist-exception';
import { EmailAlreadyExistsException } from './exceptions/email-already-exist-exception';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const userId = faker.datatype.number();
  const randomDate = faker.date.recent();

  const createUserDto: CreateUserDto = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const savedUser = {
    id: userId,
    createdAt: randomDate,
    updatedAt: randomDate,
    hashPassword() {
      return null;
    },
    ...createUserDto,
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
        username: createUserDto.username,
      });
      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(userRepositoryFindOneSpy).toBeCalledTimes(2);
      expect(userRepositorySaveSpy).toBeCalledTimes(1);
      expect(result).toHaveProperty('username', createUserDto.username);
      expect(result).toHaveProperty('email', createUserDto.email);
      expect(result).toHaveProperty('id', userId);
      expect(result).toHaveProperty('createdAt', randomDate);
      expect(result).toHaveProperty('updatedAt', randomDate);
      expect(result).not.toHaveProperty('password');
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
        username: createUserDto.username,
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
        username: createUserDto.username,
      });
      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(userRepositoryFindOneSpy).toBeCalledTimes(2);
    });
  });

  describe('findOne', () => {
    it.todo('Username is not found');
    it.todo('Successfully findOne');
  });
});
