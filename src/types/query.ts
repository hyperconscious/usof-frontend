import { PostStatus } from './post';

export interface AuthorFilter {
  id: number;
}

export interface Filters {
  postId?: number;
  status?: PostStatus;
  postAuthor?: AuthorFilter;
  categoryId?: number;
  categories?: string;
  dateRange?: string;
}

export interface QueryOptions {
  page: number;
  limit: number;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  filters?: Filters;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
