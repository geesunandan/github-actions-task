import dbClient from '@/config/database';
import PetRepository from './pets';
import { userFactory } from '@/test/factories/users';
import { petFactory } from '@/test/factories/pets';
import { Species } from '@prisma/client';

describe('Pet Repository', () => {
  const petRepository = new PetRepository();

  describe('create', () => {
    describe('given valid params', () => {
      it('creates pets', async () => {
        const user = userFactory();
        const userEmail = 'dev@noveltytechnology.com.co';
        const userPayload = { ...user, email: userEmail };
        const createdUser = await dbClient.user.create({ data: userPayload });
        const pets = petFactory();
        const petPayload = { ...pets, user: { connect: { id: createdUser.id } } };

        const createdPet = await petRepository.create(petPayload);

        const data = await dbClient.pet.findUnique({ where: { id: createdPet.id } });
        expect(data).not.toBeNull();
        expect(data?.userId).toBe(createdUser.id);
      });
    });

    describe('given INVALID params', () => {
      it('rejects with error', async () => {
        const petPayload = { ...petFactory(), user: { connect: { id: 3 } } };

        await expect(petRepository.create(petPayload)).rejects.toThrow();
      });
    });
  });

  describe('update', () => {
    describe('given valid params', () => {
      it('updates pets', async () => {
        const user = userFactory();
        const userEmail = 'dev@noveltytechnology.com.co';
        const userPayload = { ...user, email: userEmail };
        const createdUser = await dbClient.user.create({ data: userPayload });
        const pets = petFactory();
        const petPayload = { ...pets, species: Species.dog, user: { connect: { id: createdUser.id } } };
        const createdPet = await petRepository.create(petPayload);

        const updatePayload = { species: Species.cat, name: 'Tom' };
        const updatedPet = await petRepository.update({ id: createdPet.id, userId: createdUser.id }, updatePayload);

        expect(updatedPet.name).toBe('Tom');
        expect(updatedPet.species).toBe(Species.cat);
      });
    });

    describe('given INVALID params', () => {
      it('throws error', async () => {
        const updatePayload = { species: Species.cat, name: 'Tom' };

        await expect(petRepository.update({ id: 1, userId: 2 }, updatePayload)).rejects.toThrow();
      });
    });
  });

  describe('remove', () => {
    describe('given valid params', () => {
      it('update pets status to unavailable', async () => {
        const user = userFactory();
        const userEmail = 'dev@noveltytechnology.com.co';
        const userPayload = { ...user, email: userEmail };
        const createdUser = await dbClient.user.create({ data: userPayload });
        const pets = petFactory();
        const petPayload = { ...pets, species: Species.dog, user: { connect: { id: createdUser.id } } };
        const createdPet = await petRepository.create(petPayload);

        const removedPet = await petRepository.remove(createdPet.id);

        expect(removedPet.available).toBe(false);
      });
    });

    describe('given INVALID params', () => {
      it('throws error', async () => {
        await expect(petRepository.remove(2)).rejects.toThrow();
      });
    });
  });

  describe('findById', () => {
    describe('given valid params', () => {
      it('returns the pet', async () => {
        const user = userFactory();
        const userEmail = 'dev@noveltytechnology.com.co';
        const userPayload = { ...user, email: userEmail };
        const createdUser = await dbClient.user.create({ data: userPayload });
        const pets = petFactory();
        const petPayload = { ...pets, species: Species.dog, user: { connect: { id: createdUser.id } } };
        const createdPet = await petRepository.create(petPayload);

        const pet = await petRepository.findById(createdPet.id);

        expect(pet).not.toBeNull();
        expect(pet?.species).toBe(Species.dog);
      });
    });

    describe('given INVALID params', () => {
      it('returns null', async () => {
        const pet = await petRepository.findById(3);

        expect(pet).toBeNull();
      });
    });
  });
});
