import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import * as validator from '@/lib/validator';

export function schema(validationSchema: any) {
  return (request: Request, response: Response, next: NextFunction) => {
    return validator
      .validate(request.body, validationSchema)
      .then(() => next())
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).json(error));
  };
}
