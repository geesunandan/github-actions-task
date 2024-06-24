import request from 'supertest';
import { Species } from '@prisma/client';

import app, { server } from '../../server';

import dbClient from '@/config/database';
import * as jwt from '@/lib/jwt';
import UserRepository, { UserSchema } from '@/repositories/users';
import UserManager from '@/services/users/users';
import PetRepository from '@/repositories/pets';
import { userFactory } from '@/test/factories/users';
import { petFactory } from '@/test/factories/pets';

describe('Pets post API:', () => {
  let token: string;
  let user: UserSchema;
  beforeAll(async () => {
    user = { ...userFactory(), email: 'unique.user@noveltytechnology.com.co' };
    token = await jwt.generateAccessToken(user);
  });
  describe('given valid params', () => {
    afterEach(async () => {
      await server.close();
    });

    it('returns created pet with status 201', async () => {
      const userRepository = new UserRepository();
      const userManager = new UserManager(userRepository);
      await userManager.create(user);

      const petPayload = { ...petFactory(), name: 'Tom', species: Species.cat };
      const response = await request(app).post('/api/v1/pets').send(petPayload).set('authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe('Tom');
      expect(response.body.species).toBe(Species.cat);
    });
  });

  describe('given NO authorization header is passed', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws unauthorized error', async () => {
      const petPayload = { ...petFactory(), name: 'Tom', species: Species.cat };

      const response = await request(app).post('/api/v1/pets').send(petPayload);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('given INVALID payload object', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws bad request error', async () => {
      const userRepository = new UserRepository();
      const userManager = new UserManager(userRepository);
      await userManager.create(user);
      const petPayload = { ...petFactory(), name: 'Tom', species: 'mouse' };

      const response = await request(app).post('/api/v1/pets').set('authorization', `Bearer ${token}`).send(petPayload);

      expect(response.statusCode).toBe(400);
    });
  });
});

describe('Pets PUT API:', () => {
  let token: string;
  let user: UserSchema;
  beforeAll(async () => {
    user = { ...userFactory(), email: 'unique.user@noveltytechnology.com.co' };
    token = await jwt.generateAccessToken(user);
  });
  describe('given valid params', () => {
    afterEach(async () => {
      await server.close();
    });

    it('returns updated pet with status 200', async () => {
      const userRepository = new UserRepository();
      const petRepository = new PetRepository();
      const userManager = new UserManager(userRepository);
      const createdUser = await userManager.create(user);
      const petPayload = {
        ...petFactory(),
        name: 'Tom',
        species: Species.cat,
        user: { connect: { id: createdUser.id } }
      };
      const createdPet = await petRepository.create(petPayload);

      const updatePayload = { species: Species.dog, name: 'Bruno' };
      const response = await request(app)
        .put(`/api/v1/pets/${createdPet.id}`)
        .send(updatePayload)
        .set('authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('Bruno');
      expect(response.body.species).toBe(Species.dog);
    });
  });

  describe('given NO authorization header is passed', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws unauthorized error', async () => {
      const petPayload = { ...petFactory(), name: 'Tom', species: Species.cat };

      const response = await request(app).put('/api/v1/pets/1').send(petPayload);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('given INVALID payload object', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws bad request error', async () => {
      const userRepository = new UserRepository();
      const petRepository = new PetRepository();
      const userManager = new UserManager(userRepository);
      const createdUser = await userManager.create(user);
      const petPayload = {
        ...petFactory(),
        name: 'Tom',
        species: Species.cat,
        user: { connect: { id: createdUser.id } }
      };
      const createdPet = await petRepository.create(petPayload);

      const updatePayload = { name: 'Tom', species: 'mouse' };
      const response = await request(app)
        .put(`/api/v1/pets/${createdPet.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(updatePayload);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('given entity that does NOT EXIST', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws not found error', async () => {
      const userRepository = new UserRepository();
      const petRepository = new PetRepository();
      const userManager = new UserManager(userRepository);
      const createdUser = await userManager.create(user);
      const petPayload = {
        ...petFactory(),
        name: 'Tom',
        species: Species.cat,
        user: { connect: { id: createdUser.id } }
      };
      await petRepository.create(petPayload);

      const updatePayload = { name: 'Bruno', species: Species.dog };
      const response = await request(app)
        .put(`/api/v1/pets/4`)
        .set('authorization', `Bearer ${token}`)
        .send(updatePayload);

      expect(response.statusCode).toBe(404);
    });
  });
});

describe('Pets DELETE API:', () => {
  let token: string;
  let user: UserSchema;
  beforeAll(async () => {
    user = { ...userFactory(), email: 'unique.user@noveltytechnology.com.co' };
    token = await jwt.generateAccessToken(user);
  });
  describe('given valid params', () => {
    afterEach(async () => {
      await server.close();
    });

    it('returns deleted pet with status 200', async () => {
      const userRepository = new UserRepository();
      const petRepository = new PetRepository();
      const userManager = new UserManager(userRepository);
      const createdUser = await userManager.create(user);
      const petPayload = {
        ...petFactory(),
        name: 'Tom',
        species: Species.cat,
        user: { connect: { id: createdUser.id } }
      };
      const createdPet = await petRepository.create(petPayload);

      const response = await request(app)
        .delete(`/api/v1/pets/${createdPet.id}`)
        .set('authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.available).toBe(false);
    });
  });

  describe('given NO authorization header is passed', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws unauthorized error', async () => {
      const petPayload = { ...petFactory(), name: 'Tom', species: Species.cat };

      const response = await request(app).put('/api/v1/pets/1').send(petPayload);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('given entity that does NOT EXIST', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws not found error', async () => {
      const userRepository = new UserRepository();
      const petRepository = new PetRepository();
      const userManager = new UserManager(userRepository);
      const createdUser = await userManager.create(user);
      const petPayload = {
        ...petFactory(),
        name: 'Tom',
        species: Species.cat,
        user: { connect: { id: createdUser.id } }
      };
      await petRepository.create(petPayload);

      const response = await request(app).delete(`/api/v1/pets/4`).set('authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });
});

describe('Pets GET detail API:', () => {
  let token: string;
  let user: UserSchema;
  beforeAll(async () => {
    user = { ...userFactory(), email: 'unique.user@noveltytechnology.com.co' };
    token = await jwt.generateAccessToken(user);
  });
  describe('given valid params', () => {
    afterEach(async () => {
      await server.close();
    });

    it('returns  pet with status 200', async () => {
      const userRepository = new UserRepository();
      const petRepository = new PetRepository();
      const userManager = new UserManager(userRepository);
      const createdUser = await userManager.create(user);
      const petPayload = {
        ...petFactory(),
        name: 'Tom',
        species: Species.cat,
        user: { connect: { id: createdUser.id } }
      };
      const createdPet = await petRepository.create(petPayload);

      const response = await request(app).get(`/api/v1/pets/${createdPet.id}`).set('authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('Tom');
      expect(response.body.species).toBe(Species.cat);
      expect(response.body.extraInformation).toBe('This is extra information');
    });
  });

  describe('given NO authorization header is passed', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws unauthorized error', async () => {
      const response = await request(app).get('/api/v1/pets/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('given entity that does NOT EXIST', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws not found error', async () => {
      const userRepository = new UserRepository();
      const petRepository = new PetRepository();
      const userManager = new UserManager(userRepository);
      const createdUser = await userManager.create(user);
      const petPayload = {
        ...petFactory(),
        name: 'Tom',
        species: Species.cat,
        user: { connect: { id: createdUser.id } }
      };
      await petRepository.create(petPayload);

      const response = await request(app).get(`/api/v1/pets/4`).set('authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });
});

describe('Pets GET list API:', () => {
  let token: string;
  let user: UserSchema;
  beforeAll(async () => {
    user = { ...userFactory(), email: 'unique.user@noveltytechnology.com.co' };
    token = await jwt.generateAccessToken(user);
  });
  describe('given only valid pagination params', () => {
    afterEach(async () => {
      await server.close();
    });

    it('returns all data with Pagination', async () => {
      const userRepository = new UserRepository();
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

      const response = await request(app)
        .get(`/api/v1/pets/?currentPage=1&maxRows=2`)
        .set('authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.pets.length).toBe(2);
      expect(response.body.meta).toEqual({
        totalRowCount: 3,
        totalPageCount: 2,
        perPageCount: 2,
        currentPage: 1
      });
    });
  });

  describe('given NO authorization header is passed', () => {
    afterEach(async () => {
      await server.close();
    });

    it('throws unauthorized error', async () => {
      const response = await request(app).get('/api/v1/pets/');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('given there no records', () => {
    afterEach(async () => {
      await server.close();
    });

    it('returns empty array', async () => {
      const response = await request(app).get(`/api/v1/pets`).set('authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.pets.length).toBe(0);
      expect(response.body.meta).toEqual({
        totalRowCount: 0,
        totalPageCount: 0,
        perPageCount: 10,
        currentPage: 1
      });
    });
  });
});
