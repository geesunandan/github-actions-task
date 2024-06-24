import BaseQuery from './baseQuery';

import dbClient from '@/config/database';
import UserRepository from '@/repositories/users';

import { petFactory } from '@/test/factories/pets';
import { userFactory } from '@/test/factories/users';

describe('PetQuery', () => {
  describe('given pagination is enabled', () => {
    const userRepository = new UserRepository();

    it('returns valid paginated data', async () => {
      const user = userFactory();
      const createdUser = await userRepository.createUser(user);
      const petPayload = [
        {
          ...petFactory(),
          userId: createdUser.id
        },
        {
          ...petFactory(),
          userId: createdUser.id
        },
        {
          ...petFactory(),
          userId: createdUser.id
        }
      ];
      await dbClient.pet.createMany({ data: petPayload });

      const paginationQuery = new BaseQuery({
        paginationParams: { currentPage: 1, maxRows: 2 },
        databaseModel: dbClient.pet
      });
      const data = await paginationQuery.query();

      expect(data.length).toEqual(2);
    });
  });

  describe('given pagination is DISABLED', () => {
    const userRepository = new UserRepository();

    it('returns all data without pagination', async () => {
      const user = userFactory();
      const createdUser = await userRepository.createUser(user);
      const petPayload = [
        {
          ...petFactory(),
          userId: createdUser.id
        },
        {
          ...petFactory(),
          userId: createdUser.id
        },
        {
          ...petFactory(),
          userId: createdUser.id
        }
      ];
      await dbClient.pet.createMany({ data: petPayload });

      const paginationQuery = new BaseQuery({
        isPaginated: false,
        databaseModel: dbClient.pet
      });
      const data = await paginationQuery.query();

      expect(data.length).toEqual(3);
    });
  });
});
