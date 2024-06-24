import { Response, NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Species } from '@prisma/client';

import { PAGINATION_CURRENT_PAGE, PAGINATION_LIMIT } from '@/constants/constants';
import { AuthorizedRequest } from '@/middlewares/auth';
import PetPresenters from '@/presenters/pets';
import PetRepository, { IPetRepository } from '@/repositories/pets';
import PetManager from '@/services/pets/pets';

import PetQuery from '../queries/pets/petQuery';

class PetController {
  private repository: IPetRepository;

  constructor() {
    this.repository = new PetRepository();
  }

  create = async (request: Request, response: Response, next: NextFunction) => {
    const authorizedRequest = request as unknown as AuthorizedRequest;
    const payload = request.body;
    const userId = authorizedRequest.user.id;
    const petPayload = { ...payload, userId };

    new PetManager(this.repository)
      .create(petPayload)
      .then((data) => response.status(StatusCodes.CREATED).json(data))
      .catch((error) => next(error));
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    const authorizedRequest = request as unknown as AuthorizedRequest;
    const payload = request.body;
    const userId = authorizedRequest.user.id;
    const id = Number(request.params.id);
    const petPayload = { payload, userId, id };

    new PetManager(this.repository)
      .update(petPayload)
      .then((data) => response.status(StatusCodes.OK).json(data))
      .catch((error) => next(error));
  };

  remove = async (request: Request, response: Response, next: NextFunction) => {
    const authorizedRequest = request as unknown as AuthorizedRequest;
    const userId = authorizedRequest.user.id;
    const id = Number(request.params.id);

    new PetManager(this.repository)
      .remove({ id, userId })
      .then((data) => response.status(StatusCodes.OK).json(data))
      .catch((error) => next(error));
  };

  findDetail = async (request: Request, response: Response, next: NextFunction) => {
    const id = Number(request.params.id);

    new PetManager(this.repository)
      .findDetail(id)
      .then((data) => response.status(StatusCodes.OK).json(new PetPresenters().findDetail(data)))
      .catch((error) => next(error));
  };

  listPets = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const name = request.query.name?.toString();
      const species = request.query.species?.toString() as unknown as Species;
      const currentPage = Number(request.query.currentPage || PAGINATION_CURRENT_PAGE);
      const maxRows = Number(request.query.maxRows || PAGINATION_LIMIT);

      const filteredPets = await new PetQuery({
        paginationParams: { currentPage, maxRows },
        filters: { name, species }
      }).listAll();
      const totalRowCount = (await new PetQuery({ isPaginated: false, filters: { name, species } }).listAll()).length;
      const result = new PetPresenters().listPets(filteredPets, { totalRowCount, perPageCount: maxRows, currentPage });

      return response.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default new PetController();
