import { Injectable, inject } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { AuthStore } from '../stores/auth.store';
import { data } from '../mocks/usuarios.mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private store = inject(AuthStore);

  login = (correo: string, password: string, remember: boolean) => {
    const user = data.find(
      (user) => user.correo === correo && user.password === password
    );
    if (user) {
      this.store.login(user, remember);
      return of(user).pipe(delay(600));
    }
    return throwError(() => new Error('Credenciales inválidas'));
  };

  logout = () => {
    this.store.logout();
    return of(null).pipe(delay(600));
  };

  current = () => {
    return this.store.user();
  };
}
