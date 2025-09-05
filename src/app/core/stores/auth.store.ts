import { Injectable, computed, signal } from '@angular/core';
import { UsuarioType } from '../types/usuario.type';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private storageKey = 'dinamica.auth.user';
  private _user = signal<UsuarioType | null>(null);
  user = this._user.asReadonly();
  isAuthenticated = computed(() => !!this._user());

  constructor() {
    this.rehydrate();
  }

  /** Intenta rehidratar el usuario persistido */
  rehydrate = () => {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as UsuarioType;
      // Reconstruir campos Date (persisten como string)
      const withDates: UsuarioType = {
        ...parsed,
        fechaCreacion: new Date(parsed.fechaCreacion),
        fechaActualizacion: new Date(parsed.fechaActualizacion),
        ultimaConexion: new Date(parsed.ultimaConexion),
      };
      this._user.set(withDates);
    } catch {
      // ignore errors de parsing/storage
    }
  };

  login = (user: UsuarioType, remember: boolean) => {
    this._user.set(user);
    try {
      if (remember) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch {
      // ignore storage errors
    }
  };

  logout = () => {
    this._user.set(null);
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // ignore
    }
  };
}
