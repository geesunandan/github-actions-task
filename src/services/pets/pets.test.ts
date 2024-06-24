import { petFactory } from '@/test/factories/pets';

import PetManager from './pets';

import PetRepository from '@/repositories/pets';
import UserRepository from '@/repositories/users';
import { Species } from '@prisma/client';
import NotFoundError from '@/lib/notFoundError';

describe('UserManager:', () => {
  const userRepository = new UserRepository();
  const petRepository = new PetRepository();
  const petManager = new PetManager(petRepository);

  describe('createPet', () => {
    describe('given valid params', () => {
      it('creates the pet records successfully', async () => {
        const userPayload = {
          name: 'dev noveltytechnology',
          email: 'dev@noveltytechnology.comhq.co',
          password: 'random'
        };
        const createdUser = await userRepository.createUser(userPayload);

        const petPayload = {
          ...petFactory(),
          user: { connect: { id: createdUser.id } },
          name: 'Tom',
          species: Species.cat
        };
        const createdPet = await petManager.create(petPayload);

        expect(createdPet.species).toEqual(Species.cat);
        expect(createdPet.name).toEqual('Tom');
      });
    });
  });

  describe('updatePet', () => {
    describe('given valid params', () => {
      it('updates the pet records successfully', async () => {
        const userPayload = {
          name: 'dev noveltytechnology',
          email: 'dev@noveltytechnology.comhq.co',
          password: 'random'
        };
        const createdUser = await userRepository.createUser(userPayload);
        const petPayload = {
          ...petFactory(),
          user: { connect: { id: createdUser.id } },
          name: 'Tom',
          species: Species.cat
        };
        const createdPet = await petManager.create(petPayload);

        const updatePayload = { species: Species.dog, name: 'Bruno' };
        const updatedPet = await petManager.update({
          id: createdPet.id,
          userId: createdUser.id,
          payload: updatePayload
        });

        expect(updatedPet.species).toEqual(Species.dog);
        expect(updatedPet.name).toEqual('Bruno');
      });
    });

    describe('given INVALID entity that does not exist', () => {
      it('throws not found error', async () => {
        const updatePayload = { species: Species.dog, name: 'Bruno' };
        await expect(
          petManager.update({
            id: 1,
            userId: 2,
            payload: updatePayload
          })
        ).rejects.toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('removePet', () => {
    describe('given valid params', () => {
      it('removes the pet from availability', async () => {
        const userPayload = {
          name: 'dev noveltytechnology',
          email: 'dev@noveltytechnology.comhq.co',
          password: 'random'
        };
        const createdUser = await userRepository.createUser(userPayload);
        const petPayload = {
          ...petFactory(),
          user: { connect: { id: createdUser.id } },
          name: 'Tom',
          species: Species.cat
        };
        const createdPet = await petManager.create(petPayload);

        const updatedPet = await petManager.remove({
          id: createdPet.id,
          userId: createdUser.id
        });

        expect(updatedPet.available).toBe(false);
      });
    });

    describe('given INVALID entity that does not exist', () => {
      it('throws not found error', async () => {
        await expect(
          petManager.remove({
            id: 1,
            userId: 2
          })
        ).rejects.toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('findPetDetail', () => {
    describe('given valid params', () => {
      it('returns the pet detail', async () => {
        const userPayload = {
          name: 'dev noveltytechnology',
          email: 'dev@noveltytechnology.comhq.co',
          password: 'random'
        };
        const createdUser = await userRepository.createUser(userPayload);
        const petPayload = {
          ...petFactory(),
          user: { connect: { id: createdUser.id } },
          name: 'Tom',
          species: Species.cat
        };
        const createdPet = await petManager.create(petPayload);

        const pet = await petManager.findDetail(createdPet.id);

        expect(pet).not.toBeNull();
        expect(pet.species).toBe(Species.cat);
        expect(pet.name).toBe('Tom');
      });
    });

    describe('given INVALID entity that does not exist', () => {
      it('throws not found error', async () => {
        await expect(petManager.findDetail(3)).rejects.toBeInstanceOf(NotFoundError);
      });
    });
  });
});
