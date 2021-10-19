import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { getRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exist-exception';
import { EmailAlreadyExistsException } from './exceptions/email-already-exist-exception';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
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
    const validation_error = await validate(newUser);
    if (validation_error.length > 0) {
      const _error = { username: 'UserInput is not valid check type' };
      throw new HttpException(
        {
          message: 'Input data validation failed',
          _error,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const userId = await this.userRepository.save(newUser).then((v) => v.id);
      return { userId: userId };
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(email: string) {
    return await this.userRepository.delete({ email: email });
  }
}
