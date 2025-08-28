import { Injectable, signal } from '@angular/core';
import { UsuarioType } from '../types/usuario.type';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _user = signal<UsuarioType | null>(null);
  user = this._user.asReadonly();
  private storageKey = 'dinamica.auth.user';

  constructor() {
    // Rehydrate from localStorage to keep session across ng serve reloads
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as UsuarioType;
        this._user.set(parsed);
      }
    } catch {
      // ignore
    }
  }
  login(u: UsuarioType) {
    this._user.set(u);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(u));
    } catch {
      // ignore storage errors
    }
  }
  logout() {
    this._user.set(null);
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // ignore
    }
  }
}
