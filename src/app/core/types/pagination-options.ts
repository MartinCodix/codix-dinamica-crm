// K permite incluir claves derivadas adicionales para ordenamiento (por ejemplo campos calculados)
export interface PaginationOptionsType<T, K extends string = never> {
  search?: string;
  sortBy?: keyof T | K; // permitir ordenar por clave derivada simple
  sortDir?: 'asc' | 'desc';
  filters?: Partial<Record<keyof T, any>>;
  sorts?: { key: keyof T | K; dir: 'asc' | 'desc' }[];
}