import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { InputComponent } from '../../core/components/input/input.component';
import { ClienteService } from '../../core/services/cliente.service';
import { ResponseType } from '../../core/types/response.type';
import { ClienteType } from '../../core/types/cliente.type';
import { PaginationType } from '../../core/types/pagination.type';
import {
  ActionsComponent
} from '../../core/components/actions/actions.component';
import { ActionType } from '../../core/types/action.type';

@Component({
  standalone: true,
  selector: 'app-clientes',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    InputComponent,
    ActionsComponent,
  ],
  templateUrl: './clientes.page.html',
})
export class ClientesPage {
  private service = inject(ClienteService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  customers = signal([] as ClienteType[]);
  pagination = signal<PaginationType<ClienteType> | null>(null);
  q = '';
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;

  isLoading: boolean = false;
  isEditing: boolean = false;
  menuId: string | null = null; // kept for potential external control

  actions(customer: ClienteType): ActionType[] {
    return [
      {
        label: 'Cotizar',
        icon: 'pi-file',
        handler: () => this.open(customer),
      },
      {
        label: 'Editar',
        icon: 'pi-pencil',
        handler: () => this.open(customer),
      },
      {
        label: 'Eliminar',
        icon: 'pi-trash',
        variant: 'danger',
        handler: () => this.remove(customer),
      },
    ];
  }

  trackByCustomer(_index: number, c: any) {
    return c?.clienteId || c?.id || _index;
  }

  constructor() {
    this.list(1, this.pageSize);
  }

  list(page: number = 1, pageSize: number = this.pageSize) {
    console.log(`GET /api/customers?page=${page}&pageSize=${pageSize}`);
    this.isLoading = true;
    this.service.list(page, pageSize).subscribe({
      next: (response: ResponseType<PaginationType<ClienteType>>) => {
        if (response.status === 'success' && response.data) {
          this.pagination.set(response.data);
          this.customers.set(response.data.items);
          this.pageSize = response.data.pageSize;
        } else if (response.status === 'error') {
          console.error('Error fetching customers', response.message);
        } else {
          console.warn('Unexpected response', response);
        }
        this.isLoading = false;
      }
    });
  }

  changePageSize(size: any) {
    const n = Number(size);
    if (!Number.isFinite(n) || n <= 0) return;
    this.pageSize = n;
    this.list(1, this.pageSize);
  }

  goTo(page: number) {
    if (!this.pagination()) return;
    const p = Math.min(Math.max(1, page), this.pagination()!.totalPages);
    if (p !== this.pagination()!.page) {
      this.list(p, this.pageSize);
    }
  }

  remove(customer: any) {
    console.log('DELETE /api/customers/{id}', customer);
    this.menuId = null;
  }

  open(customer?: any | null) {
    this.menuId = null;
    if (customer) {
      const id = customer.clienteId || customer.customerId || customer.id;
      if (!id) {
        console.warn('Cliente sin identificador válido', customer);
        return;
      }
      this.router.navigate(['/clientes', id]);
    } else {
      this.router.navigate(['/clientes', 'nuevo']);
    }
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
