import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ClienteType } from '../types/cliente.type';
import { ResponseType } from '../types/response.type';
import { paginateCustomers, __allCustomers, PaginateCustomerOptions } from '../mocks/clientes.mock';
import { PaginationType } from '../types/pagination.type';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  list(page: number = 1, pageSize: number = 10, opts: PaginateCustomerOptions = {}): Observable<ResponseType<PaginationType<ClienteType>>> {
    const pageData = paginateCustomers(page, pageSize, opts);
    const response: ResponseType<PaginationType<ClienteType>> = {
      data: pageData,
      status: 'success',
    };
    return of(response).pipe(delay(400));
  }

  get(id: string): Observable<ResponseType<ClienteType | null>> {
    const customer = __allCustomers.find(c => c.clienteId === id) || null;
  return of({ status: 'success' as const, data: customer }).pipe(delay(300));
  }

  create(payload: Partial<ClienteType>): Observable<ResponseType<ClienteType>> {
    // Simulación: generar id y devolver
    const created: ClienteType = {
      clienteId: 'c' + (Math.floor(Math.random() * 10000) + 1000),
      clave: payload.clave || 'CLI-' + Math.floor(Math.random() * 999).toString().padStart(3, '0'),
      nombre: payload.nombre || 'Nuevo Cliente',
      tipo: payload.tipo || 'Mayorista',
      contacto: payload.contacto || '',
      notas: payload.notas,
      activo: payload.activo ?? true,
    };
    console.log('POST /api/customers (mock)', created);
  return of({ status: 'success' as const, data: created }).pipe(delay(500));
  }

  update(id: string, payload: Partial<ClienteType>): Observable<ResponseType<ClienteType | null>> {
    console.log('PUT /api/customers/' + id + ' (mock)', payload);
    // Sólo eco de payload combinado con id
    const updated: ClienteType | null = payload ? {
      clienteId: id,
      clave: payload.clave || 'CLI-XXX',
      nombre: payload.nombre || 'Cliente Actualizado',
      tipo: payload.tipo || 'Mayorista',
      contacto: payload.contacto || '',
      notas: payload.notas,
      activo: payload.activo ?? true,
    } : null;
  return of({ status: 'success' as const, data: updated }).pipe(delay(500));
  }
}
