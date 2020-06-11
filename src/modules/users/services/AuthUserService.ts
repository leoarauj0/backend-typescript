import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../../../config/auth';

import User from '../../../models/User';

import AppError from '../../../errors/AppError';

interface Req {
  email: string;
  password: string;
}

interface Res {
  user: User;
  token: string;
}

class AuthUserService {
  public async execute({ email, password }: Req): Promise<Res> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Combinação de email e senha incorreta.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Combinação de email e senha incorreta.', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthUserService;
