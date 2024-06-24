import request from 'supertest';
import app, { server } from '../../server';

import UserRepository from '@/repositories/users';
import { userFactory } from '@/test/factories/users';

describe('User post API:', () => {
  describe('given valid params', () => {
    it('returns created user with status 201', async () => {
      const user = userFactory();
      const userPayload = {
        name: user.name,
        email: 'unique.user@noveltytechnology.com.co',
        password: user.password
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send({ email: userPayload.email, password: userPayload.password, name: userPayload.name });

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe('unique.user@noveltytechnology.com.co');
    });
  });

  describe('given email is NOT unique', () => {
    afterEach(async () => {
      await server.close();
    });
    const userRepository = new UserRepository();
    it('returns with unprocessable entity error', async () => {
      const user = userFactory();
      const userPayload = {
        name: user.name,
        email: 'dev@noveltytechnology.com.co',
        password: user.password
      };
      await userRepository.createUser(userPayload);

      request(app)
        .post('/api/v1/users')
        .send({ email: userPayload.email, password: userPayload.password, name: userPayload.name })
        .end((err, res) => {
          expect(res.statusCode).toBe(500);
        });
    });
  });
});
