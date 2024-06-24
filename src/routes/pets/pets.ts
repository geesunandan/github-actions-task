import { Router } from 'express';

import petController from '@/controllers/pets';
import { schema } from '@/middlewares/validate';
import authenticate from '@/middlewares/auth';

import { createSchema, updateSchema } from './schema';

const petRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of pet
 *         species:
 *           type: string
 *           enum: [dog, cat]
 *           description: The pet species
 *         available:
 *           type: boolean
 *           description: Whether pet is available
 *         addedDate:
 *           type: string
 *           format: date
 *           description: The date the pet was added
 *       example:
 *         id: 1
 *         name: Tom
 *         species: cat
 *         available: true
 *         addedDate: 2020-03-10T04:05:06.157Z
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
 *   name: Pets
 *   description: The Pets managing API
 * /pets:
 *   get:
 *     summary: Lists all the pets
 *     parameters:
 *       - in: query
 *         name: maxNumber
 *         schema:
 *           type: number
 *         description: Per page limit
 *       - in: query
 *         name: currentPage
 *         schema:
 *           type: number
 *         description: current page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of pet
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Species of pet
 *       - in: headers
 *         name: authentication
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: The list of the pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *          description: Some server error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *
 *
 *   post:
 *     summary: Create a new pet
 *     parameters:
 *       - in: headers
 *         name: authentication
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: The created pet.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
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
 *       401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *
 * /pets/{id}:
 *   get:
 *     summary: Get the pet by id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pet id
 *       - in: headers
 *         name: authentication
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: The pet response by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: The pet was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     summary: Update the pet by the id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Pet id
 *       - in: headers
 *         name: authentication
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: The Pet was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: The pet was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Some error happened
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *       401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Remove the pet by id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *       - in: headers
 *         name: authentication
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: The book was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: The book was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *       500:
 *         description: Some error happened
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
petRouter.post('/', authenticate, schema(createSchema), petController.create);
petRouter.put('/:id', authenticate, schema(updateSchema), petController.update);
petRouter.delete('/:id', authenticate, petController.remove);
petRouter.get('/', authenticate, petController.listPets);
petRouter.get('/:id', authenticate, petController.findDetail);

export default petRouter;
