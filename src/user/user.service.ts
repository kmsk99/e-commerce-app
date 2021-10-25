import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exist-exception';
import { EmailAlreadyExistsException } from './exceptions/email-already-exist-exception';
import { UserNotFoundException } from './exceptions/user-not-found-exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const validation_error = await validate(createUserDto);
    if (validation_error.length > 0) {
      const error = { username: 'UserInput is not valid check type' };
      throw new HttpException(
        {
          message: 'Input data validation failed',
          error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { username, email, password } = createUserDto;

    // const getByUserName = getRepository(UserEntity)
    //   .createQueryBuilder('user')
    //   .where('user.username = :username', { username });

    // const byUserName = await getByUserName.getOne();
    const thisUser = await this.userRepository.findOne({ username: username });
    if (thisUser) {
      const error = 'UserName is already exists';
      throw new UsernameAlreadyExistsException(error);
    }

    // const getByEmail = getRepository(UserEntity)
    //   .createQueryBuilder('user')
    //   .where('user.email = :email', { email });

    // const byEmail = await getByEmail.getOne();
    const thisEmail = await this.userRepository.findOne({
      email: email,
    });
    if (thisEmail) {
      const error = 'Email is already exists';
      throw new EmailAlreadyExistsException(error);
    }

    // create new user
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.password = password;
    newUser.email = email;
    await this.userRepository.save(newUser);
    const result = this.passwordFilter(this.findOne(username));
    return result;
  }

  async findAll() {
    const allUsernames = await this.userRepository.find({
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });
    return allUsernames;
  }

  async findOne(name: string) {
    const thisUser = await this.userRepository.findOne({ username: name });
    if (!thisUser) {
      const error = 'Username is not found';
      throw new UserNotFoundException(error);
    }
    return thisUser;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const thisUser = await this.userRepository.findOne({ username: username });
    if (!thisUser) {
      const error = 'Username is not found';
      throw new UserNotFoundException(error);
    }
    this.userRepository.update(thisUser.id, { ...updateUserDto });
    return this.findOne(username);
  }

  async remove(username: string) {
    this.findOne(username);
    await this.userRepository.delete({ username: username });
    return 'Successfully deleted';
  }

  async passwordFilter(result: Promise<UserEntity>) {
    const { password, ...restResult } = await result;
    return restResult;
  }
}
