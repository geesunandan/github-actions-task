import request from 'supertest';

import UserManager from '@/services/users/users';
import { userFactory } from '@/test/factories/users';
import UserRepository from '@/repositories/users';

import app, { server } from '../../server';

describe('User login test', () => {
  describe('given valid credentials', () => {
    it('returns tokens logging in user', async () => {
      const userManager = new UserManager(new UserRepository());
      const user = userFactory();
      const userPayload = {
        name: user.name,
        email: 'unique.user@gmail.com',
        password: user.password
      };
      await userManager.create(userPayload);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'unique.user@gmail.com', password: user.password });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('unique.user@gmail.com');
    });
  });

  describe('given INVALID credentials', () => {
    afterEach(async () => {
      await server.close();
    });
    const user = userFactory();

    it('throws unprocessable entity error', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'unique.user@gmail.com', password: user.password });

      expect(response.statusCode).toBe(422);
    });
  });
});
