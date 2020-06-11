import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;

}

export default function Autenticado( req: Request, res: Response, next: NextFunction ): void  {

  // Validação do token JWT

  const authHeader = req.headers.authorization;

  if(!authHeader) {
    throw new AppError('Token perdido', 401)
  }

  //Bearer

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    console.log(decoded);
    return next();
  }catch (err) {
    throw new AppError('Token inválido', 401);
  }

}
