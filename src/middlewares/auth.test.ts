import sinon from 'sinon';
import { Response, NextFunction } from 'express';

import * as jwt from '@/lib/jwt';
import { UserSchema } from '@/repositories/users';
import { userFactory } from '@/test/factories/users';
import authenticate, { AuthorizedRequest } from './auth';
import { withoutAttrs } from '@/helpers/object';

describe('authentication middleware', () => {
  let mockExpressRequest: Partial<AuthorizedRequest>;
  let mockExpressResponse: Partial<Response>;
  let mockNextFunction: NextFunction;

  let token: string;
  let user: UserSchema;
  beforeAll(async () => {
    mockExpressRequest = {};
    mockExpressResponse = {};
    mockNextFunction = () => {};
    user = userFactory();
    token = await jwt.generateAccessToken(user);
  });

  describe('given there is NO token sent', () => {
    it('throws unauthorized error', async () => {
      mockExpressRequest.method = 'POST';
      mockExpressRequest.body = {};
      mockExpressRequest.is = (arg: string) => {
        return 'true';
      };
      mockExpressRequest.headers = {};
      mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
        return {
          json: sinon.stub().callsFake((replyArg) => {
            return { status: statusArg, body: replyArg };
          })
        };
      });

      const response = await authenticate(
        mockExpressRequest as AuthorizedRequest,
        mockExpressResponse as Response,
        mockNextFunction as NextFunction
      );

      expect(response).toStrictEqual({
        status: 401,
        body: {
          message: 'No authorization header set'
        }
      });
    });
  });

  describe('given token is INVALID', () => {
    it('throws unauthorized error', async () => {
      mockExpressRequest.headers = { authorization: `random_token ${token}` };
      mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
        return {
          json: sinon.stub().callsFake((replyArg) => {
            return { status: statusArg, body: replyArg };
          })
        };
      });

      const response = await authenticate(
        mockExpressRequest as AuthorizedRequest,
        mockExpressResponse as Response,
        mockNextFunction as NextFunction
      );

      expect(response).toStrictEqual({
        status: 401,
        body: {
          message: "Authorization header doesn't include a Bearer token"
        }
      });
    });
  });

  describe('given token is valid', () => {
    it('sets the decoded user value to request object', async () => {
      mockExpressRequest.headers = { authorization: `Bearer ${token}` };
      mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
        return {
          send: sinon.stub().callsFake((replyArg) => {
            return { status: statusArg, body: replyArg };
          })
        };
      });
      process.env.accessTokenSecret = 'ENTER_ACCESS_TOKEN_SALT_HERE';

      await authenticate(
        mockExpressRequest as AuthorizedRequest,
        mockExpressResponse as Response,
        mockNextFunction as NextFunction
      );

      expect(withoutAttrs(mockExpressRequest.user, ['exp', 'iat', 'createdAt', 'updatedAt'])).toStrictEqual(
        withoutAttrs(user, ['createdAt', 'updatedAt'])
      );
    });
  });
});
