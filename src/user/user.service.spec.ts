import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import * as faker from 'faker';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it.todo('validation_errors');
    it.todo('UserName is already exists');
    it.todo('Email is already exists');
    it.todo('Successfully create');
  });

  describe('findOne', () => {
    it.todo('Username is not found');
    it.todo('Successfully findOne');
  });
});
