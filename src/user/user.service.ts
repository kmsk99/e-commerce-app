import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exist.exception';
import { EmailAlreadyExistsException } from './exceptions/email-already-exist.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const validation_error = await validate(createUserDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { username, email, password } = createUserDto;

    const thisUser = await this.userRepository.findOne({ username: username });
    if (thisUser) {
      throw new UsernameAlreadyExistsException();
    }

    const thisEmail = await this.userRepository.findOne({
      email: email,
    });
    if (thisEmail) {
      throw new EmailAlreadyExistsException();
    }

    // create new user
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.password = password;
    newUser.email = email;
    const result = await this.userRepository.save(newUser);
    return this.passwordFilter(result);
  }

  async findOne(name: string) {
    const thisUser = await this.userRepository.findOne({ username: name });
    if (!thisUser) {
      throw new UserNotFoundException();
    }
    return this.passwordFilter(thisUser);
  }

  async findOnePassword(name: string) {
    const thisUser = await this.userRepository.findOne({ username: name });
    if (!thisUser) {
      throw new UserNotFoundException();
    }
    return thisUser;
  }

  async findByUserId(id: number) {
    const thisUser = await this.userRepository.findOne({ id: id });
    if (!thisUser) {
      throw new UserNotFoundException();
    }
    return this.passwordFilter(thisUser);
  }

  passwordFilter(result: UserEntity) {
    const { password, hashPassword, ...restResult } = result;
    return restResult;
  }
}
