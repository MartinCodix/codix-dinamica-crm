import { Component, computed, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
  private confirm = inject(ConfirmService);

  visible = this.confirm.visible;
  opts = this.confirm.options;

  color = computed(() => this.opts()?.color ?? 'yellow');
  header = computed(() => this.opts()?.header ?? 'Confirmar');
  message = computed(() => this.opts()?.message ?? '');
  acceptLabel = computed(() => this.opts()?.acceptLabel ?? 'Aceptar');
  rejectLabel = computed(() => this.opts()?.rejectLabel ?? 'Cancelar');
  iconClass = computed(
    () => this.opts()?.iconClass ?? 'pi pi-exclamation-triangle'
  );

  // Mapas de clases para asegurar que Tailwind no purgue estilos
  private textClasses: Record<string, string> = {
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
    lightBlue: 'text-lightBlue-500',
  };
  private buttonClasses: Record<string, string> = {
    yellow:
      'hover:bg-yellow-600 focus:ring-yellow-500 text-yellow-600 hover:text-white dark:text-yellow-400 dark:hover:text-dark-700',
    blue: 'hover:bg-blue-600 focus:ring-blue-500 text-blue-600 hover:text-white dark:text-blue-400',
    lightBlue:
      'hover:bg-lightBlue-600 focus:ring-lightBlue-500 text-lightBlue-600 hover:text-lightBlue dark:text-lightBlue-400',
  };

  iconColor = computed(
    () => this.textClasses[this.color()] || this.textClasses['yellow']
  );
  buttonColor = computed(
    () => this.buttonClasses[this.color()] || this.buttonClasses['yellow']
  );

  accept = () => {
    this.confirm.accept();
  };
  reject = () => {
    this.confirm.reject();
  };

  @HostListener('document:keydown.escape') onEscape = () => {
    this.reject();
  };
}
