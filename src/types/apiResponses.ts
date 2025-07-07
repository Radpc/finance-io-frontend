interface Pagination {
  total: number;
  page: number;
}

export interface PaginatedResponse<T> {
  pagination: Pagination;
  items: T[];
}

export type ControllerResponse<T> = {
  data: T;
  message?: string;
};
