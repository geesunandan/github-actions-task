import { userFactory } from '@/test/factories/users';

import UserRepository from '@/repositories/users';
import UserManager from '../users/users';
import AuthManager from './auth';

describe('Auth:', () => {
  describe('login', () => {
    const userRepository = new UserRepository();
    const userManager = new UserManager(userRepository);
    const authManager = new AuthManager(userRepository);
    describe('given correct credentials', () => {
      it('returns user', async () => {
        const user = userFactory();
        const password = 'password';
        const userPayload = { name: user.name, email: user.email, password: password };
        await userManager.create(userPayload);

        const data = await authManager.login({
          email: user.email,
          password
        });

        expect(data).not.toBeNull();
        expect(data?.user.email).toEqual(user.email);
        expect(data?.user.name).toEqual(user.name);
        expect(data?.accessToken).not.toBeNull();
        expect(data?.refreshToken).not.toBeNull();
      });
    });

    describe('given there is NO user as credential', () => {
      it('throws custom error', async () => {
        await expect(authManager.login({ email: 'dev@noveltytechnology.com.co', password: 'random' })).rejects.toHaveProperty(
          'message',
          'Provided email or password does not match.'
        );
      });
    });

    describe('given NO credentials are passed', () => {
      it('throws bad request error', async () => {
        await expect(authManager.login({ email: '', password: '' })).rejects.toHaveProperty(
          'message',
          'Provided email or password does not match.'
        );
      });
    });

    describe('given passed password is INCORRECT', () => {
      it('throws custom error', async () => {
        const user = userFactory();
        const userPayload = {
          name: user.name,
          email: 'user@noveltytechnology.com.co',
          password: user.password
        };
        await userManager.create(userPayload);

        await expect(
          authManager.login({
            email: 'user@noveltytechnology.com.co',
            password: '1234567'
          })
        ).rejects.toHaveProperty('message', 'Provided email or password does not match.');
      });
    });
  });
});
