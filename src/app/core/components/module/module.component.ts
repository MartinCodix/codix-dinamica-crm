import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  inject, 
  signal,
  HostListener 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationType } from '../../types/pagination.type';
import { ActionType } from '../../types/action.type';
import { TableColumnType } from '../../types/table-column.type';
import { HeaderComponent } from '../header/header.component';
import { InputComponent } from '../input/input.component';
import { ActionsComponent } from '../actions/actions.component';
import { TableType } from '../../types/table.type';

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    InputComponent,
    ActionsComponent,
  ],
  templateUrl: './module.component.html',
})
export class ModuleComponent<T = any> {
  private router = inject(Router);

  @Input() config!: TableType<T>;
  @Input() data: T[] = [];
  @Input() pagination: PaginationType<T> | null = null;
  @Input() loading = false;
  @Input() search = '';
  @Input() pageSizeOptions = [5, 10, 20, 50];
  @Input() pageSize = 10;
  @Input() sorts: { key: string; dir: 'asc' | 'desc' }[] = [];
  @Input() actionsProvider!: (item: T) => ActionType[];

  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() newItemClick = new EventEmitter<void>();

  menuId: string | null = null;

  onSearch = (search: string) => {
    this.searchChange.emit(search);
  };

  onSort = (column: string) => {
    this.sortChange.emit(column);
  };

  onPageSize = (size: any) => {
    const n = Number(size);
    if (n && n > 0) {
      this.pageSizeChange.emit(n);
    }
  };

  goTo = (page: number) => {
    this.pageChange.emit(page);
  };

  onNewItem = () => {
    this.newItemClick.emit();
  };

  getIcon = (column: string): string => {
    const sort = this.sorts.find((s) => s.key === column);
    if (!sort) return 'pi pi-sort-alt text-gray-400';
    return sort.dir === 'asc' 
      ? 'pi pi-sort-amount-up text-blue-500' 
      : 'pi pi-sort-amount-down text-blue-500';
  };

  getCellValue = (item: T, column: TableColumnType<T>): any => {
    if (column.render) {
      return column.render(item);
    }
    return (item as any)[column.key];
  };

  formatCellValue = (value: any, column: TableColumnType<T>): { text: string; class?: string; icon?: string } => {
    if (typeof value === 'object' && value !== null && 'text' in value) {
      return value;
    }

    switch (column.type) {
      case 'currency':
        return {
          text: typeof value === 'number' ? value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00'
        };
      case 'date':
        return {
          text: value instanceof Date ? value.toLocaleDateString() : value?.toString() || ''
        };
      case 'status':
        // Para status booleanos como activo/inactivo
        if (typeof value === 'boolean') {
          return {
            text: value ? 'Activo' : 'Inactivo',
            class: `inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${
              value ? 'text-green-600' : 'text-gray-400'
            }`,
            icon: value ? 'pi-circle-fill' : 'pi-circle'
          };
        }
        return { text: value?.toString() || '' };
      default:
        return { text: value?.toString() || '' };
    }
  };

  trackBy = (index: number, item: T): any => {
    return (item as any)?.id || (item as any)?.usuarioId || (item as any)?.clienteId || (item as any)?.cotizacionId || index;
  };

  // Helper para Math en template
  Math = Math;

  @HostListener('document:click')
  close = () => {
    this.menuId = null;
  };

  @HostListener('document:keydown.escape')
  escape = () => {
    this.menuId = null;
  };
}
