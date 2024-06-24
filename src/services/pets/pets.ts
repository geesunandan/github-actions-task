import { PetCreatePayload, PetUpdatePayload, PetSchema, IPetRepository } from '@/repositories/pets';
import NotFoundError from '@/lib/notFoundError';

// import PetError from './error';

interface UpdateParameters {
  id: number;
  userId: number;
  payload: PetUpdatePayload;
}

interface DeleteParameters {
  id: number;
  userId: number;
}

export interface IPetManager {
  create: (payload: PetCreatePayload) => Promise<PetSchema>;
  update: (updateParameters: UpdateParameters) => Promise<PetSchema>;
  remove: (deleteParameters: DeleteParameters) => Promise<PetSchema>;
  findDetail: (id: number) => Promise<PetSchema>;
}

class PetManager implements IPetManager {
  private petRepository: IPetRepository;

  constructor(petRepository: IPetRepository) {
    this.petRepository = petRepository;
  }

  create = async (payload: PetCreatePayload) => {
    try {
      const pets = await this.petRepository.create(payload);

      return pets;
    } catch (error) {
      throw error;
    }
  };

  update = async (updateParameters: UpdateParameters) => {
    const { id, userId, payload } = updateParameters;
    try {
      const existingPet = await this.petRepository.findWithUserId(id, userId);
      if (!existingPet) {
        throw new NotFoundError({ message: 'Pet resource not found' });
      }

      const pets = await this.petRepository.update({ id, userId }, payload);

      return pets;
    } catch (error) {
      throw error;
    }
  };

  remove = async (deleteParameters: DeleteParameters) => {
    const { id, userId } = deleteParameters;
    try {
      const existingPet = await this.petRepository.findWithUserId(id, userId);
      if (!existingPet) {
        throw new NotFoundError({ message: 'Pet resource not found' });
      }

      const pets = await this.petRepository.remove(id);

      return pets;
    } catch (error) {
      throw error;
    }
  };

  findDetail = async (id: number) => {
    try {
      const pet = await this.petRepository.findById(id);

      if (!pet) {
        throw new NotFoundError({ message: 'Pet resource not found' });
      }

      return pet;
    } catch (error) {
      throw error;
    }
  };
}

export default PetManager;
