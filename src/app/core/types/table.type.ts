import { TableColumnType } from "./table-column.type";

export interface TableType<T = any> {
  columns: TableColumnType<T>[];
  emptyState: {
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
  };
  moduleInfo: {
    icon: string;
    title: string;
    itemName: string; // 'usuarios', 'clientes', etc.
  };
  searchPlaceholder: string;
  loadingText: string;
}
