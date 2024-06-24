import * as jwt from '@/lib/jwt';
import * as crypt from '@/lib/crypt';
import * as object from '@/helpers/object';
import { UserSchema } from '@/repositories/users';
import { IUserRepository } from '@/repositories/users';

import AuthError from './error';

export interface LoginResponse {
  user: UserSchema;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

interface IAuthManager {
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  refreshToken: (payload: RefreshPayload) => Promise<RefreshResponse>;
}

class AuthManager implements IAuthManager {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  login = async (payload: LoginPayload) => {
    const user = await this.userRepository.findByEmailWithPassword(payload.email);
    if (!user) {
      throw new AuthError({
        message: 'Provided email or password does not match.'
      });
    }

    if (!user.password) {
      throw new AuthError({ message: 'Provided email or password does not match.' });
    }

    const passwordMatches = await crypt.compareWithHashValue(payload.password, user.password);
    if (!passwordMatches) {
      throw new AuthError({ message: 'Provided email or password does not match.' });
    }

    const UserDetail = object.withoutAttrs<UserSchema>(user, ['password']);
    const refreshToken = jwt.generateRefreshToken(user);
    const accessToken = jwt.generateAccessToken(user);

    return {
      user: UserDetail,
      accessToken: accessToken,
      refreshToken: refreshToken
    };
  };

  refreshToken = async (payload: RefreshPayload) => {
    const refreshPayload = (await this.verifyRefreshToken(payload.refreshToken)) as UserSchema;

    let user = object.withoutAttrs<UserSchema>(refreshPayload, ['iat', 'exp']);

    const accessToken = await jwt.generateAccessToken(user);

    return {
      accessToken
    };
  };

  private verifyRefreshToken = async (token: string) => {
    try {
      return jwt.verifyRefreshToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AuthError({ message: 'Refresh token expired' });
      }

      throw new AuthError({ message: 'Refresh token expired' });
    }
  };
}

export default AuthManager;
