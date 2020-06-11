import 'reflect-metadata';

import express, {
  Request, Response, NextFunction, response,
} from 'express';
import 'express-async-errors';
import cors from 'cors';

import routes from './routes/index.routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'Erro interno no servidor',
    });
  },
);

app.listen(3333, () => {
  console.log('🚀 Servidor iniciado na porta 3333!');
});
