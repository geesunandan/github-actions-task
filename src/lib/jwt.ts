import * as jwt from 'jsonwebtoken';

import { appConfig } from '@/config/appConfig';
import * as object from '@/helpers/object';
import { UserSchema } from '@/repositories/users';

export interface AccessTokens {
  accessToken: string;
  refreshToken: string;
}

export function generateTokens(data: UserSchema): AccessTokens {
  return {
    accessToken: generateAccessToken(data),
    refreshToken: generateRefreshToken(data)
  };
}

export function generateAccessToken(data: UserSchema, extraSalt: string = ''): string {
  const { accessTokenSecret, accessTokenDuration } = appConfig.auth;
  const secret = accessTokenSecret + extraSalt;
  const payload = object.withoutAttrs<UserSchema>({ ...data }, ['exp', 'iat']);

  return generateToken(payload, secret, {
    expiresIn: accessTokenDuration
  });
}

export function generateRefreshToken(data: UserSchema, extraSalt: string = ''): string {
  const { refreshTokenSecret, refreshTokenDuration } = appConfig.auth;
  const secret = refreshTokenSecret + extraSalt;

  return generateToken(data, secret, {
    expiresIn: refreshTokenDuration
  });
}

export function verifyRefreshToken(token: string, extraSalt: string = '') {
  const { refreshTokenSecret } = appConfig.auth;
  const secret = refreshTokenSecret + extraSalt;

  return verifyToken(token, secret);
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}

export function decode(token: string): null | object | string {
  return jwt.decode(token);
}

export function generateToken(payload: string | object | Buffer, secret: string, options?: jwt.SignOptions): string {
  return jwt.sign(payload, secret, options);
}
