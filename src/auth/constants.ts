import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'test'
      ? '.env.test'
      : process.env.NODE_ENV === 'dev'
      ? '.env.dev'
      : '.env',
  ),
});

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  // secret: 'secret',
};
