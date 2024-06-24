import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import AuthManager from '@/services/auth/auth';
import UserRepository, { IUserRepository } from '@/repositories/users';

class AuthController {
  private repository: IUserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  login = async (request: Request, response: Response, next: NextFunction) => {
    const payload = request.body;

    new AuthManager(this.repository)
      .login(payload)
      .then((data) => response.status(StatusCodes.OK).json(data))
      .catch((error) => next(error));
  };

  refreshToken = async (request: Request, response: Response, next: NextFunction) => {
    new AuthManager(this.repository)
      .refreshToken(request.body)
      .then((data) => response.status(StatusCodes.OK).json(data))
      .catch((error) => next(error));
  };
}

export default new AuthController();
