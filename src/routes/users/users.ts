import { Router } from 'express';

import userController from '@/controllers/users';
import { schema } from '@/middlewares/validate';

import { userRegistrationSchema } from './schema';

const userRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of pet
 *         email:
 *           type: string
 *           description: unique user email
 *         password:
 *           type: string
 *           description: user password
 *       example:
 *         id: 1
 *         name: Dev noveltytechnology
 *         email: dev.noveltytechnology.co
 *         password: random
 *
 *     Error:
 *       type: Object
 *       properties:
 *         message:
 *           type: string
 *           description: error message
 *       example:
 *         message: Something went wrong
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *          description: Some server error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *       422:
 *          description: Unprocessable Content
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *       400:
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *
 */
userRouter.post('/', schema(userRegistrationSchema), userController.createUser);

export default userRouter;
