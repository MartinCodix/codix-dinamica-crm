import { Component, effect, inject } from '@angular/core';
import { AuthStore } from './core/stores/auth.store';
import { MainLayout } from './core/layouts/main.layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayout],
  template: `<app-layout />`,
})
export class App {
  private auth = inject(AuthStore);
  constructor() {
    effect(() => {
      /* para debug de sesión */ this.auth.user();
    });
  }
}
