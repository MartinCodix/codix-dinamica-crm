export interface PaginationType<T> {
  items: T[];
  total: number;
  page: number; // 1-based
  pageSize: number;
  // Derivados
  totalPages: number;
  pageItemCount: number;
  from: number; // 1-based index en dataset global
  to: number;
  offset: number; // 0-based para SQL OFFSET
  hasPrevious: boolean;
  hasNext: boolean;
  previousPage: number | null;
  nextPage: number | null;
  isFirstPage: boolean;
  isLastPage: boolean;
  // Metadatos opcionales
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
  search?: string | null;
}
