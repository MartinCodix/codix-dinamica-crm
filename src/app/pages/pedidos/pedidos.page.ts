import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ModuleComponent } from '../../core/components/module/module.component';
import { PedidoService } from '../../core/services/pedido.service';

import { PedidoType } from '../../core/types/pedido.type';
import { PaginationType } from '../../core/types/pagination.type';
import { ResponseType } from '../../core/types/response.type';
import { ActionType } from '../../core/types/action.type';
import { TableType } from '../../core/types/table.type';

@Component({
  standalone: true,
  selector: 'app-pedidos',
  imports: [CommonModule, ModuleComponent],
  templateUrl: './pedidos.page.html',
})
export class PedidosPage {
  private router = inject(Router);
  private pedidoService = inject(PedidoService);

  config: TableType<PedidoType> = {
    columns: [
      {
        key: 'pedidoId',
        label: 'NO.',
        sortable: true,
        type: 'text',
        align: 'left',
        width: '120px',
      },
      {
        key: 'cliente',
        label: 'Cliente',
        sortable: true,
        sortKey: 'clienteNombre',
        type: 'text',
        align: 'left',
        render: (pedido: PedidoType) => ({
          text: pedido.cliente?.nombre || 'Sin cliente',
        }),
      },
      {
        key: 'vendedor',
        label: 'Vendedor',
        sortable: true,
        sortKey: 'vendedorNombre',
        type: 'text',
        align: 'left',
        render: (pedido: PedidoType) => ({
          text: pedido.vendedor?.nombre || 'Sin vendedor',
        }),
      },
      {
        key: 'fecha',
        label: 'Fecha',
        sortable: true,
        type: 'date',
        align: 'left',
        width: '120px',
      },
      {
        key: 'total',
        label: 'Total',
        sortable: true,
        type: 'currency',
        align: 'right',
        width: '120px',
        render: (pedido: PedidoType) => ({
          text: `$${pedido.total
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${pedido.preciosEn === 'MN' ? 'MXN' : 'USD'}`,
        }),
      },
      {
        key: 'oc',
        label: 'OC',
        sortable: true,
        type: 'text',
        align: 'center',
        width: '120px',
      },
      {
        key: 'especial',
        label: 'Especial',
        sortable: true,
        type: 'status',
        align: 'center',
        width: '80px',
        render: (pedido: PedidoType) => ({
          text: pedido.especial ? 'Sí' : 'No',
          variant: pedido.especial ? 'warning' : 'secondary',
        }),
      },
      {
        key: 'urgente',
        label: 'Urgente',
        sortable: true,
        type: 'status',
        align: 'center',
        width: '80px',
        render: (pedido: PedidoType) => ({
          text: pedido.urgente ? 'Sí' : 'No',
          variant: pedido.urgente ? 'danger' : 'secondary',
        }),
      },
    ],
    emptyState: {
      icon: 'pi-shopping-cart',
      title: 'No hay pedidos',
      description:
        'Cree un nuevo pedido para comenzar a gestionar órdenes de compra.',
      actionLabel: 'Nuevo pedido',
    },
    moduleInfo: {
      icon: 'pi-shopping-cart',
      title: 'Pedidos',
      itemName: 'pedidos',
    },
    searchPlaceholder: 'Buscar por ID, cliente, vendedor o OC...',
    loadingText: 'Cargando pedidos...',
  };

  pedidos = signal([] as PedidoType[]);
  pagination = signal<PaginationType<PedidoType> | null>(null);
  search = '';
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;
  sorts: { key: string; dir: 'asc' | 'desc' }[] = [];
  loading = false;
  menuId: string | null = null;

  constructor() {
    this.list(1, this.pageSize);
  }

  actions = (item: PedidoType): ActionType[] => [
    {
      label: 'Ver',
      icon: 'pi-eye',
      handler: () => this.onVer(item),
    },
    {
      label: 'Editar',
      icon: 'pi-pencil',
      handler: () => this.onMenu(item),
    },
    {
      label: 'Eliminar',
      icon: 'pi-trash',
      variant: 'danger',
      handler: () => this.remove(item),
    },
  ];

  list = (page: number = 1, pageSize: number = this.pageSize) => {
    this.loading = true;
    this.pedidoService
      .list(page, pageSize, {
        search: this.search || undefined,
        sorts: this.sorts.length ? (this.sorts as any) : undefined,
      })
      .subscribe({
        next: (response: ResponseType<PaginationType<PedidoType>>) => {
          this.pedidos.set(response.data?.items || []);
          this.pagination.set(response.data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  };

  remove = (item: PedidoType) => {
    console.log('DELETE /api/pedidos/{id}', item);
    this.menuId = null;
    this.list(1, this.pageSize);
  };

  onSearch = (search: string) => {
    this.search = search;
    this.list(1, this.pageSize);
  };

  onSort = (column: string) => {
    const idx = this.sorts.findIndex((s) => s.key === column);
    if (idx === -1) {
      this.sorts.push({ key: column, dir: 'asc' });
    } else {
      if (this.sorts[idx].dir === 'asc') {
        this.sorts[idx].dir = 'desc';
      } else {
        this.sorts.splice(idx, 1);
      }
    }
    this.list(1, this.pageSize);
  };

  onMenu = (item?: PedidoType | null) => {
    this.menuId = null;
    if (item) {
      this.menuId = item.pedidoId;
      this.router.navigate(['/pedidos', item.pedidoId]);
    } else {
      this.router.navigate(['/pedidos/nuevo']);
    }
  };

  onVer = (item: PedidoType) => {
    this.router.navigate(['/pedidos', item.pedidoId], {
      queryParams: { readonly: true },
    });
  };

  onPageSize = (size: number) => {
    this.pageSize = size;
    this.list(1, this.pageSize);
  };

  goTo = (page: number) => {
    this.list(page, this.pageSize);
  };
}
