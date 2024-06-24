import * as crypt from '@/lib/crypt';
import { UserPayload, UserSchema, IUserRepository } from '@/repositories/users';

import UserError from './error';

export interface IUserManager {
  create: (payload: UserPayload) => Promise<UserSchema>;
}

class UserManager implements IUserManager {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  create = async (payload: UserPayload) => {
    try {
      if (!payload.email || !payload.password) {
        throw new UserError({
          message: 'Please enter email and password.'
        });
      }

      const user = await this.userRepository.findByEmail(payload.email);
      if (user) {
        throw new UserError({ message: 'Account with this email already exists.' });
      }

      const encryptedPassword = await crypt.hash(payload.password);
      const userPayload = {
        ...payload,
        password: encryptedPassword
      };
      const createdUser = await this.userRepository.createUser(userPayload);

      return createdUser;
    } catch (error) {
      throw error;
    }
  };
}

export default UserManager;
