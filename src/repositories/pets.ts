import { Prisma, Pet } from '@prisma/client';

import dbClient from '@/config/database';

export type PetCreatePayload = Prisma.PetCreateInput;
export type PetUpdatePayload = Prisma.PetUpdateInput;
export type PetSchema = Pet;

interface UpdateQueryParams {
  id: number;
  userId: number;
}
export interface IPetRepository {
  create: (payload: PetCreatePayload) => Promise<PetSchema>;
  update: (updateQueryParameters: UpdateQueryParams, payload: PetUpdatePayload) => Promise<PetSchema>;
  findWithUserId: (id: number, userId: number) => Promise<PetSchema | null>;
  remove: (id: number) => Promise<PetSchema>;
  findById: (id: number) => Promise<PetSchema | null>;
}

class PetRepository implements IPetRepository {
  create = async (payload: PetCreatePayload) => {
    const pet = await dbClient.pet.create({ data: payload });

    return pet;
  };

  update = async (updateQueryParams: UpdateQueryParams, payload: PetUpdatePayload) => {
    const { id, userId } = updateQueryParams;
    const updateQuery = { where: { id, userId } };
    const updatedResult = await dbClient.pet.update({ ...updateQuery, data: payload });

    return updatedResult;
  };

  findWithUserId = async (id: number, userId: number) => {
    const pet = await dbClient.pet.findUnique({ where: { id, userId } });

    return pet;
  };

  remove = async (id: number) => {
    const deleteQuery = { where: { id } };
    const removedPet = await dbClient.pet.update({ ...deleteQuery, data: { available: false } });

    return removedPet;
  };

  findById = async (id: number) => {
    const pet = await dbClient.pet.findUnique({ where: { id } });

    return pet;
  };
}

export default PetRepository;
