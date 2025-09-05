import { Component, effect, inject } from '@angular/core';
import { AuthStore } from './core/stores/auth.store';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  private auth = inject(AuthStore);
  constructor() {
    effect(() => {
      /* para debug de sesión */ this.auth.user();
    });
  }
}
