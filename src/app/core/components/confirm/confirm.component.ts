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

  header = computed(() => this.opts()?.header ?? 'Confirmar');
  message = computed(() => this.opts()?.message ?? '');
  acceptLabel = computed(() => this.opts()?.acceptLabel ?? 'Aceptar');
  rejectLabel = computed(() => this.opts()?.rejectLabel ?? 'Cancelar');
  iconClass = computed(() => this.opts()?.iconClass ?? 'pi pi-exclamation-triangle');

  accept() { this.confirm.accept(); }
  reject() { this.confirm.reject(); }

  @HostListener('document:keydown.escape') onEsc() { this.reject(); }
}
