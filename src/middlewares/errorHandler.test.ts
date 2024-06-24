import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';

import { emptyBody, notFoundHandler } from './errorHandler';
import { StatusCodes } from 'http-status-codes';

describe('handleErrorMiddleware: ', () => {
  let mockExpressRequest: Partial<Request>;
  let mockExpressResponse: Partial<Response>;
  let mockNextFunction: NextFunction;
  let err: any;

  beforeAll(async () => {
    mockExpressRequest = {};
    mockExpressResponse = {};
    mockNextFunction = () => {};
    err = {};
  });

  describe('given payload is empty', () => {
    it('throws 400 error', async () => {
      mockExpressRequest.method = 'POST';
      mockExpressRequest.body = {};
      mockExpressRequest.is = (arg: string) => {
        return 'true';
      };
      mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
        return {
          json: sinon.stub().callsFake((replyArg) => {
            return { status: statusArg, body: replyArg };
          })
        };
      });

      const data = emptyBody(
        mockExpressRequest as Request,
        mockExpressResponse as Response,
        mockNextFunction as NextFunction
      );

      expect(data).toStrictEqual({
        status: StatusCodes.BAD_REQUEST,
        body: {
          message: 'Payload is invalid.'
        }
      });
    });
  });

  describe('given requested resource is not found', () => {
    it('throws 404 error', async () => {
      mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
        return {
          json: sinon.stub().callsFake((replyArg) => {
            return { status: statusArg, body: replyArg };
          })
        };
      });

      const data = notFoundHandler(
        err as any,
        mockExpressRequest as Request,
        mockExpressResponse as Response,
        mockNextFunction as NextFunction
      );

      expect(data).toStrictEqual({
        status: StatusCodes.NOT_FOUND,
        body: {
          message: 'Requested resource is not found'
        }
      });
    });
  });
});
