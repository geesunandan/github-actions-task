import { Pet, Species } from '@prisma/client';

import dbClient from '@/config/database';

import BaseQuery, { QueryParams, BaseQueryInterface } from '../baseQuery';

interface PetFilter {
  name?: string;
  species?: Species;
}

interface PetQueryParams extends Omit<QueryParams, 'databaseModel'> {
  filters?: PetFilter;
}

interface PetQueryInterface extends BaseQueryInterface<Pet> {
  filters?: PetFilter;
}

class PetQuery extends BaseQuery<Pet> implements PetQueryInterface {
  filters?: PetFilter;

  constructor(queryParams: PetQueryParams) {
    super({ ...queryParams, databaseModel: dbClient.pet });

    this.filters = queryParams.filters;
  }

  async listAll() {
    this.buildPaginationQueryParams();
    return this.databaseModel.findMany({ where: this.filters, ...this.paginationQuery });
  }
}

export default PetQuery;
