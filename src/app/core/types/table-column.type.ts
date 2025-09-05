export interface TableColumnType<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  sortKey?: string; // Para columnas derivadas como 'clienteNombre'
  align?: 'left' | 'center' | 'right';
  width?: string;
  type?: 'text' | 'status' | 'currency' | 'date' | 'custom';
  render?: (item: T) => string | { text: string; class?: string; icon?: string };
}
