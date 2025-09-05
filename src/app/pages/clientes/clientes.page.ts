import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ModuleComponent } from '../../core/components/module/module.component';

import { ClienteService } from '../../core/services/cliente.service';
import { ConfirmService } from '../../core/services/confirm.service';

import { ClienteType } from '../../core/types/cliente.type';
import { PaginationType } from '../../core/types/pagination.type';
import { ResponseType } from '../../core/types/response.type';
import { ActionType } from '../../core/types/action.type';
import { TableType } from '../../core/types/table.type';

@Component({
  standalone: true,
  selector: 'app-clientes',
  imports: [CommonModule, ModuleComponent],
  templateUrl: './clientes.page.html',
})
export class ClientesPage {
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private confirmService = inject(ConfirmService);

  config: TableType<ClienteType> = {
    columns: [
      {
        key: 'clave',
        label: 'Clave',
        sortable: true,
        type: 'text',
        align: 'left',
        width: '120px',
      },
      {
        key: 'nombre',
        label: 'Nombre',
        sortable: true,
        type: 'text',
        align: 'left',
      },
      {
        key: 'tipo',
        label: 'Tipo',
        sortable: true,
        type: 'text',
        align: 'left',
        width: '120px',
      },
      {
        key: 'contacto',
        label: 'Contacto',
        sortable: true,
        type: 'text',
        align: 'left',
      }
    ],
    emptyState: {
      icon: 'pi-inbox',
      title: 'No hay clientes registrados',
      description:
        'Cree un nuevo cliente para comenzar a gestionar el catálogo.',
      actionLabel: 'Nuevo cliente',
    },
    moduleInfo: {
      icon: 'pi-users',
      title: 'Módulo de Clientes',
      itemName: 'clientes',
    },
    searchPlaceholder: 'Buscar por nombre, clave o contacto...',
    loadingText: 'Cargando clientes...',
  };

  clientes = signal([] as ClienteType[]);
  pagination = signal<PaginationType<ClienteType> | null>(null);
  search = '';
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;
  sorts: { key: string; dir: 'asc' | 'desc' }[] = [];
  loading = false;
  editing = false;
  clienteId: string | null = null;

  constructor() {
    this.list(1, this.pageSize);
  }

  actions = (cliente: ClienteType): ActionType[] => {
    return [
      {
        label: 'Cotizar',
        icon: 'pi-file',
        handler: () => this.onCotizar(cliente),
      },
      {
        label: 'Editar',
        icon: 'pi-pencil',
        handler: () => this.onMenu(cliente),
      },
      {
        label: 'Eliminar',
        icon: 'pi-trash',
        variant: 'danger',
        handler: () => this.remove(cliente),
      },
    ];
  };

  list = (page: number = 1, pageSize: number = this.pageSize) => {
    this.loading = true;
    this.clienteService
      .list(page, pageSize, {
        search: this.search || undefined,
        sorts: this.sorts.length
          ? this.sorts.map((s) => ({
              key: s.key as keyof ClienteType,
              dir: s.dir,
            }))
          : undefined,
      })
      .subscribe({
        next: (response: ResponseType<PaginationType<ClienteType>>) => {
          this.clientes.set(response.data?.items || []);
          this.pagination.set(response.data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  };

  remove = async (cliente: ClienteType) => {
    await this.confirmService
      .ask({
        header: 'Eliminar cliente',
        message: '¿Seguro que deseas eliminar este cliente?',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        iconClass: 'pi pi-exclamation-triangle',
      })
      .then((ok) => {
        if (ok) {
          console.log('Eliminar cliente:', cliente.clienteId);
          this.list(1, this.pageSize);
        }
      });
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

  onMenu = (cliente?: ClienteType | null) => {
    this.clienteId = null;
    if (cliente) {
      this.clienteId = cliente.clienteId;
      this.editing = true;
      this.router.navigate([`/clientes/${cliente.clienteId}`]);
    } else {
      this.editing = false;
      this.router.navigate(['/clientes/nuevo']);
    }
  };

  onCotizar = (cliente: ClienteType) => {
    this.router.navigate(['/cotizacion'], {
      queryParams: { clienteId: cliente.clienteId },
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
