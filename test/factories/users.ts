import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

export const userFactory = (): User => ({
  id: faker.number.int(10000),
  name: faker.lorem.word(2),
  email: faker.internet.email(),
  password: faker.internet.password(),
  emailVerified: null,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date()
});
