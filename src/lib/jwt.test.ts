import { userFactory } from '@/test/factories/users';
import { UserSchema } from '@/repositories/users';

import { decode, generateAccessToken, generateRefreshToken } from './jwt';

describe('Generates Json Web Tokens', () => {
  const userDetail = userFactory();

  describe('generateAccessToken()', () => {
    describe('given params to generate token', () => {
      it('generates access token of type "string"', () => {
        expect(typeof generateAccessToken(userDetail)).toBe('string');
      });
    });
  });

  describe('generateRefreshToken()', () => {
    describe('given params to generate token', () => {
      it('generates refresh token of type "string"', () => {
        expect(typeof generateRefreshToken(userDetail)).toBe('string');
      });
    });
  });

  describe('decode()', () => {
    interface DecodedUserDetail extends UserSchema {
      iat: number;
      exp: number;
    }

    describe('given valid access_token', () => {
      it('returns the decoded data', () => {
        const decodedData = decode(generateAccessToken(userDetail)) as DecodedUserDetail;
        const { iat, exp, ...decodedUserDetail } = decodedData;

        expect(decodedUserDetail.email).toBe(userDetail.email);
        expect(decodedData).toHaveProperty('exp');
        expect(decodedData).toHaveProperty('iat');
      });
    });

    describe('given valid refresh_token', () => {
      it('returns the valid decoded data', () => {
        const decodedData = decode(generateRefreshToken(userDetail)) as DecodedUserDetail;
        const { iat, exp, ...decodedUserDetail } = decodedData;

        expect(decodedUserDetail.email).toEqual(userDetail.email);
        expect(decodedData).toHaveProperty('exp');
        expect(decodedData).toHaveProperty('iat');
      });
    });
  });
});
