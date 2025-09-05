import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ModuleComponent } from '../../core/components/module/module.component';
import { CotizacionService } from '../../core/services/cotizacion.service';

import { CotizacionType } from '../../core/types/cotizacion.type';
import { PaginationType } from '../../core/types/pagination.type';
import { ResponseType } from '../../core/types/response.type';
import { ActionType } from '../../core/types/action.type';
import { TableType } from '../../core/types/table.type';

@Component({
  standalone: true,
  selector: 'app-cotizaciones',
  imports: [CommonModule, ModuleComponent],
  templateUrl: './cotizaciones.page.html',
})
export class CotizacionesPage {
  private router = inject(Router);
  private cotizacionService = inject(CotizacionService);

  config: TableType<CotizacionType> = {
    columns: [
      {
        key: 'numero',
        label: 'Número',
        sortable: true,
        type: 'text',
        align: 'left',
        width: '100px',
      },
      {
        key: 'cliente',
        label: 'Cliente',
        sortable: true,
        sortKey: 'clienteNombre',
        type: 'text',
        align: 'left',
        render: (cotizacion: CotizacionType) => ({
          text: cotizacion.cliente?.nombre || 'Sin cliente',
        }),
      },
      {
        key: 'atencion',
        label: 'Atención',
        sortable: true,
        sortKey: 'atencionNombre',
        type: 'text',
        align: 'left',
        render: (cotizacion: CotizacionType) => ({
          text: cotizacion.atencion?.nombre || 'Sin atención',
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
        render: (cotizacion: CotizacionType) => ({
          text: `$
            ${cotizacion.total
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${cotizacion.preciosEn === 'MN' ? 'MXN' : 'USD'}`,
        }),
      },
      {
        key: 'formaPago',
        label: 'Forma de Pago',
        sortable: true,
        type: 'text',
        align: 'center',
        width: '120px',
      },
      {
        key: 'estado',
        label: 'Estado',
        sortable: true,
        type: 'status',
        align: 'center',
        width: '120px',
        render: (cotizacion: CotizacionType) => ({
          text: cotizacion.estado,
          variant: cotizacion.estado === 'CONVERTIDA' 
            ? 'success' 
            : cotizacion.estado === 'APROBADA' 
              ? 'primary'
              : cotizacion.estado === 'RECHAZADA' 
                ? 'danger'
                : cotizacion.estado === 'VENCIDA'
                  ? 'warning'
                  : 'secondary',
        }),
      },
    ],
    emptyState: {
      icon: 'pi-inbox',
      title: 'No hay cotizaciones',
      description:
        'Cree una nueva cotización para comenzar a gestionar ventas.',
      actionLabel: 'Nueva cotización',
    },
    moduleInfo: {
      icon: 'pi-file-edit',
      title: 'Cotizaciones',
      itemName: 'cotizaciones',
    },
    searchPlaceholder: 'Buscar por número, cliente o atención...',
    loadingText: 'Cargando cotizaciones...',
  };

  cotizaciones = signal([] as CotizacionType[]);
  pagination = signal<PaginationType<CotizacionType> | null>(null);
  search = '';
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;
  sorts: { key: string; dir: 'asc' | 'desc' }[] = [];
  loading = false;
  menuId: string | null = null;

  constructor() {
    this.list(1, this.pageSize);
  }

  actions = (item: CotizacionType): ActionType[] => {
    const baseActions: ActionType[] = [
      {
        label: 'Ver',
        icon: 'pi-eye',
        handler: () => this.onVer(item),
      },
    ];

    // Solo permitir editar si no está convertida
    if (item.estado !== 'CONVERTIDA') {
      baseActions.push({
        label: 'Editar',
        icon: 'pi-pencil',
        handler: () => this.onMenu(item),
      });
    }

    // Agregar acción de conversión si es posible
    if (item.estado === 'APROBADA' && !item.pedidoId) {
      baseActions.push({
        label: 'Convertir a Pedido',
        icon: 'pi-shopping-cart',
        handler: () => this.convertirAPedido(item),
      });
    }

    // Mostrar pedido relacionado si existe
    if (item.pedidoId) {
      baseActions.push({
        label: 'Ver Pedido',
        icon: 'pi-external-link',
        handler: () => this.verPedido(item),
      });
    }

    // Eliminar solo si no está convertida
    if (item.estado !== 'CONVERTIDA') {
      baseActions.push({
        label: 'Eliminar',
        icon: 'pi-trash',
        variant: 'danger',
        handler: () => this.remove(item),
      });
    }

    return baseActions;
  };

  list = (page: number = 1, pageSize: number = this.pageSize) => {
    this.loading = true;
    this.cotizacionService
      .list(page, pageSize, {
        search: this.search || undefined,
        sorts: this.sorts.length ? (this.sorts as any) : undefined,
      })
      .subscribe({
        next: (response: ResponseType<PaginationType<CotizacionType>>) => {
          this.cotizaciones.set(response.data?.items || []);
          this.pagination.set(response.data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  };

  remove = (item: CotizacionType) => {
    console.log('DELETE /api/cotizaciones/{id}', item);
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

  onMenu = (item?: CotizacionType | null) => {
    this.menuId = null;
    if (item) {
      this.menuId = item.cotizacionId;
      this.router.navigate(['/cotizacion'], {
        queryParams: { id: item.cotizacionId },
      });
    } else {
      this.router.navigate(['/cotizacion']);
    }
  };

  onVer = (item: CotizacionType) => {
    this.router.navigate(['/cotizacion'], {
      queryParams: { id: item.cotizacionId, readonly: true },
    });
  };

  onPageSize = (size: number) => {
    this.pageSize = size;
    this.list(1, this.pageSize);
  };

  goTo = (page: number) => {
    this.list(page, this.pageSize);
  };

  convertirAPedido = (item: CotizacionType) => {
    console.log('Convertir cotización a pedido:', item);
    // TODO: Implementar modal/formulario para capturar datos adicionales del pedido
    // Por ahora, usar conversión simple
    this.cotizacionService.convertirAPedido(item.cotizacionId).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          console.log('Conversión exitosa:', response.data);
          // Navegar al pedido creado
          this.router.navigate(['/pedidos', response.data.pedido.pedidoId]);
        }
      },
      error: (error) => {
        console.error('Error al convertir:', error);
      }
    });
  };

  verPedido = (item: CotizacionType) => {
    if (item.pedidoId) {
      this.router.navigate(['/pedidos', item.pedidoId]);
    }
  };
}
