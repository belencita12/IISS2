export type PaginationResponse<T> = {
  data: T[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPages: number;
};

export interface BaseQueryParams {
  page: number;
  size?: number;
  from?: string;
  to?: string;
  includeDeleted?: boolean;
}

export interface UseGetParams<Q extends BaseQueryParams> {
  init?: Q;
  token: string;
  condition?: boolean;
}
