import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { InputComponent } from '../../core/components/input/input.component';
import { ResponseType } from '../../core/types/response.type';
import { PaginationType } from '../../core/types/pagination.type';
import { ActionsComponent } from '../../core/components/actions/actions.component';
import { ActionType } from '../../core/types/action.type';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioType } from '../../core/types/usuario.type';

@Component({
  standalone: true,
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    InputComponent,
    ActionsComponent,
  ],
  templateUrl: './usuarios.page.html',
})
export class UsuariosPage {
  private service = inject(UsuarioService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  users = signal([] as UsuarioType[]);
  pagination = signal<PaginationType<UsuarioType> | null>(null);
  q = '';
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;
  sortBy: keyof UsuarioType | null = null;
  sortDir: 'asc' | 'desc' = 'asc';

  isLoading: boolean = false;
  isEditing: boolean = false;
  menuId: string | null = null; // kept for potential external control

  actions(user: UsuarioType): ActionType[] {
    return [
      {
        label: 'Editar',
        icon: 'pi-pencil',
        handler: () => this.open(user),
      },
      {
        label: 'Eliminar',
        icon: 'pi-trash',
        variant: 'danger',
        handler: () => this.remove(user),
      },
    ];
  }

  trackByUser(_index: number, u: UsuarioType) {
    return u?.usuarioId || _index;
  }

  constructor() {
    this.list(1, this.pageSize);
  }

  list(page: number = 1, pageSize: number = this.pageSize) {
    console.log(
      `GET /api/users?page=${page}&pageSize=${pageSize}&q=${this.q}&sortBy=${this.sortBy}&sortDir=${this.sortDir}`
    );
    this.isLoading = true;
    this.service
      .list(page, pageSize, {
        search: this.q || undefined,
        sortBy: this.sortBy || undefined,
        sortDir: this.sortDir,
      })
      .subscribe({
        next: (response: ResponseType<PaginationType<UsuarioType>>) => {
          if (response.status === 'success' && response.data) {
            this.pagination.set(response.data);
            this.users.set(response.data.items);
            this.pageSize = response.data.pageSize;
          } else if (response.status === 'error') {
            console.error('Error fetching users', response.message);
          } else {
            console.warn('Unexpected response', response);
          }
          this.isLoading = false;
        },
      });
  }

  changePageSize(size: any) {
    const n = Number(size);
    if (!Number.isFinite(n) || n <= 0) return;
    this.pageSize = n;
    this.list(1, this.pageSize);
  }

  onSearchChange() {
    // Reinicia a primera página con nueva búsqueda
    this.list(1, this.pageSize);
  }

  toggleSort(column: keyof UsuarioType) {
    if (this.sortBy === column) {
      // alternar asc -> desc -> ninguno
      if (this.sortDir === 'asc') {
        this.sortDir = 'desc';
      } else {
        // quitar orden
        this.sortBy = null;
        this.sortDir = 'asc';
      }
    } else {
      this.sortBy = column;
      this.sortDir = 'asc';
    }
    this.list(1, this.pageSize);
  }

  goTo(page: number) {
    if (!this.pagination()) return;
    const p = Math.min(Math.max(1, page), this.pagination()!.totalPages);
    if (p !== this.pagination()!.page) {
      this.list(p, this.pageSize);
    }
  }

  remove(user: any) {
    console.log('DELETE /api/users/{id}', user);
    this.menuId = null;
  }

  open(user?: any | null) {
    this.menuId = null;
    if (user) {
      const id = user.usuarioId || user.userId || user.id;
      if (!id) {
        console.warn('Registro sin identificador válido', user);
        return;
      }
      this.router.navigate(['/usuarios', id]);
    } else {
      this.router.navigate(['/usuarios', 'nuevo']);
    }
  }

  sortIcon(column: keyof UsuarioType): string {
    if (this.sortBy !== column) return 'pi text-dark-400';
    return this.sortDir === 'asc'
      ? 'pi pi-chevron-up text-dark-400'
      : 'pi pi-chevron-down text-dark-400';
  }

  @HostListener('document:click')
  close() {
    this.menuId = null;
  }

  @HostListener('document:keydown.escape')
  escape() {
    this.menuId = null;
  }
}
