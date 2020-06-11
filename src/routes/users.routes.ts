/* eslint-disable comma-dangle */
import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import CreateUserService from '../modules/users/services/CreateUserService';

import UpAvatarService from '../modules/users/services/UpAvatarService';

import autenticado from '../middlewares/Autenticado';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  //= = Pegar os dados ==
  const { name, email, password } = req.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;
  return res.json(user);
});

usersRouter.patch(
  '/avatar',
  autenticado,
  upload.single('avatar'),
  async (req, res) => {
    const upUserAvatar = new UpAvatarService();

    const user = await upUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  }
);

export default usersRouter;
