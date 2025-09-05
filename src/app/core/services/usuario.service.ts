import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UsuarioType } from '../types/usuario.type';
import { ResponseType } from '../types/response.type';
import { paginateUsers, __allUsers } from '../mocks/usuarios.mock';
import { PaginationType } from '../types/pagination.type';
import { PaginationOptionsType } from '../types/pagination-options';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  list = (
    page: number = 1,
    pageSize: number = 10,
    opts: PaginationOptionsType<UsuarioType> = {}
  ): Observable<ResponseType<PaginationType<UsuarioType>>> => {
    const pageData = paginateUsers(page, pageSize, opts);
    const response: ResponseType<PaginationType<UsuarioType>> = {
      data: pageData,
      status: 'success',
    };
    return of(response).pipe(delay(400));
  };

  get = (id: string): Observable<ResponseType<UsuarioType | null>> => {
    const user = __allUsers.find((c) => c.usuarioId === id) || null;
    return of({ status: 'success' as const, data: user }).pipe(delay(300));
  };

  create = (
    payload: Partial<UsuarioType>
  ): Observable<ResponseType<UsuarioType>> => {
    // Simulación: generar id y devolver
    const created: UsuarioType = {
      usuarioId: 'u' + (Math.floor(Math.random() * 10000) + 1000),
      nombre: payload.nombre || 'Nuevo Usuario',
      correo: payload.correo || 'nuevo@usuario.com',
      password: payload.password || 'Dinamica123',
      activo: payload.activo ?? true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      ultimaConexion: new Date(),
      enLinea: false,
    };
    console.log('POST /api/users (mock)', created);
    return of({ status: 'success' as const, data: created }).pipe(delay(500));
  };

  update = (
    id: string,
    payload: Partial<UsuarioType>
  ): Observable<ResponseType<UsuarioType | null>> => {
    console.log('PUT /api/users/' + id + ' (mock)', payload);
    // Sólo eco de payload combinado con id
    const updated: UsuarioType | null = payload
      ? {
          usuarioId: id,
          nombre: payload.nombre || 'Usuario Actualizado',
          correo: payload.correo || 'Usuario Actualizado',
          password: payload.password || 'Dinamica123',
          activo: payload.activo ?? true,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
          ultimaConexion: new Date(),
          enLinea: false,
        }
      : null;
    return of({ status: 'success' as const, data: updated }).pipe(delay(500));
  };

  delete = (id: string): Observable<ResponseType<UsuarioType | null>> => {
    console.log('DELETE /api/customers/' + id);
    return of({ status: 'success' as const, data: null }).pipe(delay(500));
  };
}
