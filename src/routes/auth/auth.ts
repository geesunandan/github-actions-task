import { Router } from 'express';

import authController from '@/controllers/auth';
import { schema } from '@/middlewares/validate';

import { authLoginSchema, refreshSchema } from './authSchema';

const authRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Unique email of user
 *         password:
 *           type: string
 *           description: Password of user
 *       example:
 *         email: dev.noveltytechnology.co
 *         password: random
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: access token for user
 *         refreshToken:
 *           type: string
 *           description: refresh token for user
 *         user: '#/components/schemas/User'
 *       example:
 *         accessToken: asdfs53wadgfgf
 *         refreshToken: asfewrwer2r3r
 *
 *     Refresh:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: refresh token for user
 *       example:
 *         refreshToken: asfewrwer2r3r
 *
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: access token for user
 *       example:
 *         accessToken: asfewrwer2r3r
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
 *   name: Auth
 *   description: Auth managing API
 * /auth/login:
 *   post:
 *     summary: Logs in the user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User logs in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
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
 * /auth/refresh:
 *   post:
 *     summary: Refreshes access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Refresh'
 *     responses:
 *       200:
 *         description: Access token is refreshed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
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
 */

authRouter.post('/login', schema(authLoginSchema), authController.login);
authRouter.post('/refresh', schema(refreshSchema), authController.refreshToken);

export default authRouter;
