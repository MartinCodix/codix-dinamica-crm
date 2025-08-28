import { Injectable, inject } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { AuthStore } from '../stores/auth.store';
import { data } from '../mocks/usuarios.mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private store = inject(AuthStore);

  login(name: string, password: string) {
    const user = data.find((user) => user.nombre === name && user.password === password);
    if (user) {
      this.store.login(user);
      return of(user).pipe(delay(600));
    }
    return throwError(() => new Error('Credenciales inválidas'));
  }

  current() {
    return this.store.user();
  }
}
