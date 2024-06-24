import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import UserRepository, { IUserRepository } from '@/repositories/users';
import UserManager from '@/services/users/users';

class UserController {
  repository: IUserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  createUser = async (request: Request, response: Response, next: NextFunction) => {
    const payload = request.body;

    new UserManager(this.repository)
      .create(payload)
      .then((user) => response.status(StatusCodes.CREATED).json(user))
      .catch((error) => next(error));
  };
}

export default new UserController();
