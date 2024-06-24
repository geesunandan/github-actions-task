import { Request, Response, Router } from 'express';

import userRouter from './users/users';
import authRouter from './auth/auth';
import petRouter from './pets/pets';

const generalRouter = Router();
const appRouter = Router();

generalRouter.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

appRouter.use('/users', userRouter);
appRouter.use('/auth', authRouter);
appRouter.use('/pets', petRouter);

export { generalRouter, appRouter };
