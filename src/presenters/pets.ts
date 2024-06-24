import { PetSchema } from '@/repositories/pets';
import { Pet } from '@prisma/client';
import { PaginationMetaParams, getPaginatedMeta } from '@/lib/pagination';

class PetPresenters {
  constructor() {}

  listPets(pets: Pet[], paginationParams: PaginationMetaParams) {
    const meta = getPaginatedMeta(paginationParams);

    return { pets, meta };
  }

  findDetail(pet: PetSchema) {
    return { ...pet, extraInformation: 'This is extra information' };
  }
}

export default PetPresenters;
