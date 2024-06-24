import dbClient from '@/config/database';
import UserRepository from './users';
import { userFactory } from '@/test/factories/users';

describe('User Repository', () => {
  const userRepository = new UserRepository();

  describe('create', () => {
    describe('given valid params', () => {
      it('creates user', async () => {
        const user = userFactory();
        const userEmail = 'dev@noveltytechnology.com.co';
        const userPayload = { ...user, email: userEmail };
        const createdUser = await userRepository.createUser(userPayload);

        const data = await dbClient.user.findUnique({ where: { id: createdUser.id } });

        expect(data).not.toBeNull();
        expect(data?.email).toEqual(userEmail);
      });
    });
  });

  describe('findByEmail', () => {
    describe('given user exists', () => {
      it('returns user', async () => {
        const user = userFactory();
        const userEmail = 'dev@noveltytechnology.com.co';
        const userPayload = { ...user, email: userEmail };
        const createdUser = await dbClient.user.create({ data: userPayload });

        const data = await userRepository.findByEmail(userEmail);

        expect(data).not.toBeNull();
        expect(data?.id).toEqual(createdUser.id);
        expect(data?.email).toEqual(userEmail);
      });
    });

    describe('given user does not exists', () => {
      it('returns null', async () => {
        const user = userFactory();
        const userEmail = 'dev@noveltytechnology.com.co';
        const userPayload = { ...user, email: userEmail };
        await dbClient.user.create({ data: userPayload });

        const data = await userRepository.findByEmail('other.user@noveltytechnology.com.co');

        expect(data).toBeNull();
      });
    });
  });
});
