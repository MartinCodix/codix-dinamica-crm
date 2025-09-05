import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ModuleComponent } from '../../core/components/module/module.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { ConfirmService } from '../../core/services/confirm.service';

import { UsuarioType } from '../../core/types/usuario.type';
import { PaginationType } from '../../core/types/pagination.type';
import { ResponseType } from '../../core/types/response.type';
import { ActionType } from '../../core/types/action.type';
import { TableType } from '../../core/types/table.type';

@Component({
  standalone: true,
  selector: 'app-usuarios',
  imports: [CommonModule, ModuleComponent],
  templateUrl: './usuarios.page.html',
})
export class UsuariosPage {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private confirmService = inject(ConfirmService);

  config: TableType<UsuarioType> = {
    columns: [
      {
        key: 'nombre',
        label: 'Nombre',
        sortable: true,
        type: 'text',
        align: 'left',
      },
      {
        key: 'correo',
        label: 'Correo',
        sortable: true,
        type: 'text',
        align: 'left',
      },
      {
        key: 'enLinea',
        label: 'Estatus',
        sortable: true,
        type: 'status',
        align: 'left',
        render: (user: UsuarioType) => ({
          text: user.enLinea ? 'Activo' : 'Inactivo',
          class: `inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${
            user.enLinea ? 'text-green-600' : 'text-gray-400'
          }`,
          icon: user.enLinea ? 'pi-circle-fill' : 'pi-circle',
        }),
      },
    ],
    emptyState: {
      icon: 'pi-inbox',
      title: 'No hay usuarios registrados',
      description:
        'Cree un nuevo usuario para comenzar a gestionar el sistema.',
      actionLabel: 'Nuevo usuario',
    },
    moduleInfo: {
      icon: 'pi-building',
      title: 'Usuarios',
      itemName: 'usuarios',
    },
    searchPlaceholder: 'Buscar por nombre o correo...',
    loadingText: 'Cargando usuarios...',
  };
  
  usuarios = signal([] as UsuarioType[]);
  pagination = signal<PaginationType<UsuarioType> | null>(null);
  search = '';
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;
  sorts: { key: string; dir: 'asc' | 'desc' }[] = [];
  loading = false;
  editing = false;
  usuarioId: string | null = null;

  constructor() {
    this.list(1, this.pageSize);
  }

  actions = (user: UsuarioType): ActionType[] => {
    return [
      {
        label: 'Editar',
        icon: 'pi-pencil',
        handler: () => this.onMenu(user),
      },
      {
        label: 'Eliminar',
        icon: 'pi-trash',
        variant: 'danger',
        handler: () => this.remove(user),
      },
    ];
  };

  list = (page: number = 1, pageSize: number = this.pageSize) => {
    this.loading = true;
    this.usuarioService
      .list(page, pageSize, {
        search: this.search || undefined,
        sorts: this.sorts.length
          ? this.sorts.map((s) => ({
              key: s.key as keyof UsuarioType,
              dir: s.dir,
            }))
          : undefined,
      })
      .subscribe({
        next: (response: ResponseType<PaginationType<UsuarioType>>) => {
          this.usuarios.set(response.data?.items || []);
          this.pagination.set(response.data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  };

  remove = async (usuario: UsuarioType) => {
    await this.confirmService
      .ask({
        header: 'Eliminar usuario',
        message: '¿Seguro que deseas eliminar este usuario?',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        iconClass: 'pi pi-exclamation-triangle',
      })
      .then((ok) => {
        if (ok) {
          console.log('Eliminar usuario:', usuario.usuarioId);
          // Aquí iría la lógica de eliminación
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

  onMenu = (user?: UsuarioType | null) => {
    this.usuarioId = null;
    if (user) {
      this.usuarioId = user.usuarioId;
      this.editing = true;
      this.router.navigate([`/usuarios/${user.usuarioId}`]);
    } else {
      this.editing = false;
      this.router.navigate(['/usuarios/nuevo']);
    }
  };

  onPageSize = (size: number) => {
    this.pageSize = size;
    this.list(1, this.pageSize);
  };

  goTo = (page: number) => {
    this.list(page, this.pageSize);
  };
}
