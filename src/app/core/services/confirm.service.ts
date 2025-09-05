import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  color?: string;
  header?: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  iconClass?: string; // e.g., 'pi pi-exclamation-triangle'
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal(false);
  options = signal<ConfirmOptions | null>(null);
  private resolver: ((value: boolean) => void) | null = null;

  ask = (options: ConfirmOptions): Promise<boolean> => {
    this.options.set({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      ...options,
    });
    this.visible.set(true);
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  };

  accept = () => {
    if (this.resolver) this.resolver(true);
    this.cleanup();
  };

  reject = () => {
    if (this.resolver) this.resolver(false);
    this.cleanup();
  };

  cleanup = () => {
    this.visible.set(false);
    this.options.set(null);
    this.resolver = null;
  };
}
