import { PAGINATION_CURRENT_PAGE, PAGINATION_LIMIT } from '@/constants/constants';
export interface PaginationParams {
  maxRows?: number;
  currentPage?: number;
}

export interface PaginationQueryParams {
  limit: number;
  offset: number;
}

export interface PaginationMetaParams {
  totalRowCount: number;
  perPageCount: number;
  currentPage: number;
}

export interface PaginatedMeta {
  totalRowCount: number;
  totalPageCount: number;
  perPageCount: number;
  currentPage: number;
}

export function getPaginationParams(params: PaginationParams = {}) {
  const { maxRows = PAGINATION_LIMIT, currentPage = PAGINATION_CURRENT_PAGE } = params;
  const skip = (currentPage - 1) * maxRows;

  return { skip, take: maxRows };
}

export function getPaginatedMeta(params: PaginationMetaParams) {
  const { totalRowCount, perPageCount, currentPage } = params;
  const totalPageCount = Math.ceil(totalRowCount / perPageCount);

  return {
    totalRowCount,
    totalPageCount,
    perPageCount,
    currentPage
  };
}
