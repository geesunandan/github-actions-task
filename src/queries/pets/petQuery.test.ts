import PetQuery from './petQuery';

import dbClient from '@/config/database';
import UserRepository from '@/repositories/users';

import { petFactory } from '@/test/factories/pets';
import { userFactory } from '@/test/factories/users';
import { Species } from '@prisma/client';

describe('PetQuery', () => {
  describe('given name Params', () => {
    it('returns filtered data', async () => {
      const user = userFactory();
      const userRepository = new UserRepository();
      const createdUser = await userRepository.createUser(user);
      const petPayload = [
        {
          ...petFactory(),
          name: 'Tom',
          userId: createdUser.id
        },
        {
          ...petFactory(),
          name: 'Tom',
          userId: createdUser.id
        },
        {
          ...petFactory(),
          userId: createdUser.id
        }
      ];
      await dbClient.pet.createMany({ data: petPayload });

      const paginationQuery = new PetQuery({
        paginationParams: { currentPage: 1, maxRows: 2 },
        filters: { name: 'Tom' }
      });
      const data = await paginationQuery.listAll();

      expect(data.length).toEqual(2);
    });
  });

  describe('given species Params', () => {
    it('returns filtered data', async () => {
      const user = userFactory();
      const userRepository = new UserRepository();
      const createdUser = await userRepository.createUser(user);
      const petPayload = [
        {
          ...petFactory(),
          name: 'Tom',
          species: Species.cat,
          userId: createdUser.id
        },
        {
          ...petFactory(),
          name: 'Tom',
          species: Species.cat,
          userId: createdUser.id
        },
        {
          ...petFactory(),
          name: 'Bruno',
          species: Species.dog,
          userId: createdUser.id
        }
      ];
      await dbClient.pet.createMany({ data: petPayload });

      const paginationQuery = new PetQuery({
        paginationParams: { currentPage: 1, maxRows: 2 },
        filters: { species: Species.cat }
      });
      const data = await paginationQuery.listAll();

      expect(data.length).toEqual(2);
    });
  });

  describe('given species and name Params', () => {
    it('returns filtered data', async () => {
      const user = userFactory();
      const userRepository = new UserRepository();
      const createdUser = await userRepository.createUser(user);
      const petPayload = [
        {
          ...petFactory(),
          name: 'Tom',
          species: Species.cat,
          userId: createdUser.id
        },
        {
          ...petFactory(),
          name: 'Butch',
          species: Species.cat,
          userId: createdUser.id
        },
        {
          ...petFactory(),
          name: 'Bruno',
          species: Species.dog,
          userId: createdUser.id
        }
      ];
      await dbClient.pet.createMany({ data: petPayload });

      const paginationQuery = new PetQuery({
        paginationParams: { currentPage: 1, maxRows: 2 },
        filters: { name: 'Tom', species: Species.cat }
      });
      const data = await paginationQuery.listAll();

      expect(data.length).toEqual(1);
    });
  });

  describe('given no Params', () => {
    it('returns all data', async () => {
      const user = userFactory();
      const userRepository = new UserRepository();
      const createdUser = await userRepository.createUser(user);
      const petPayload = [
        {
          ...petFactory(),
          name: 'Tom',
          species: Species.cat,
          userId: createdUser.id
        },
        {
          ...petFactory(),
          name: 'Butch',
          species: Species.cat,
          userId: createdUser.id
        },
        {
          ...petFactory(),
          name: 'Bruno',
          species: Species.dog,
          userId: createdUser.id
        }
      ];
      await dbClient.pet.createMany({ data: petPayload });

      const paginationQuery = new PetQuery({
        isPaginated: false
      });
      const data = await paginationQuery.listAll();

      expect(data.length).toEqual(3);
    });
  });
});
