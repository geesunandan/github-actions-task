import { PaginationParams, getPaginationParams } from '@/lib/pagination';

export interface QueryParams {
  databaseModel: any;
  paginationParams?: PaginationParams;
  isPaginated?: boolean;
}

export interface BaseQueryInterface<T> extends QueryParams {
  paginationQuery: { [index: string]: any };
  filterQuery: { [index: string]: any };

  query: () => Promise<T[]>;
  buildPaginationQueryParams: () => void;
}

class BaseQuery<T> implements BaseQueryInterface<T> {
  databaseModel: any;
  paginationParams?: PaginationParams;
  isPaginated: boolean;
  paginationQuery: { [index: string]: any };
  filterQuery: { [index: string]: any };

  constructor(queryParams: QueryParams) {
    this.databaseModel = queryParams.databaseModel;
    this.paginationParams = queryParams.paginationParams;
    this.isPaginated = queryParams.isPaginated ?? true;
    this.paginationQuery = {};
    this.filterQuery = {};
  }

  async query() {
    this.buildPaginationQueryParams();

    return this.databaseModel.findMany({
      where: { ...this.filterQuery },
      ...this.paginationQuery
    });
  }

  buildPaginationQueryParams() {
    if (!this.isPaginated) return;

    this.paginationQuery = getPaginationParams(this.paginationParams);
  }
}

export default BaseQuery;
