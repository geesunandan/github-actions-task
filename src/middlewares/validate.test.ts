import sinon from 'sinon';
import * as Joi from 'joi';

import { Request, Response, NextFunction } from 'express';

import { schema } from './validate';

describe('validationMiddleware: ', () => {
  let mockExpressRequest: Partial<Request>;
  let mockExpressResponse: Partial<Response>;
  let mockNextFunction: NextFunction;

  beforeAll(async () => {
    mockExpressRequest = {};
    mockExpressResponse = {};
    mockNextFunction = () => {};
  });

  describe('given payload is INVALID', () => {
    it('throws a 400 error', async () => {
      mockExpressRequest.method = 'POST';
      mockExpressRequest.body = { firstName: 'random', age: 'guess' };
      mockExpressRequest.is = (arg: string) => {
        return 'true';
      };

      const validationSchema = Joi.object().keys({
        firstName: Joi.string(),
        age: Joi.number()
      });
      mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
        return {
          json: sinon.stub().callsFake((replyArg) => {
            return { status: statusArg, body: replyArg };
          })
        };
      });

      const response = await schema(validationSchema)(
        mockExpressRequest as Request,
        mockExpressResponse as Response,
        mockNextFunction as NextFunction
      );

      expect(response?.status).toEqual(400);
    });
  });
});
