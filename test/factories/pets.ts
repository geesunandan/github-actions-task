import { faker } from '@faker-js/faker';
import { Pet, Species } from '@prisma/client';

export const petFactory = (): Omit<Pet, 'id' | 'userId'> => ({
  name: faker.lorem.word(2),
  species: Species.cat,
  birthYear: Number(faker.string.numeric(4)),
  dateAdded: new Date(),
  photoUrl: faker.image.url(),
  available: true
});
