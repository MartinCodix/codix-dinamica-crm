import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionType } from '../../types/action.type';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actions.component.html',
  styles: [
    `:host { display: inline-block; }
     @keyframes scale-fade { from { opacity:0; transform:scale(.95); } to { opacity:1; transform:scale(1); } }
     .animate-scale-fade { animation: scale-fade .12s ease-out; }
    `,
  ],
})
export class ActionsComponent implements OnInit, OnDestroy {
  // Mantiene registro global de instancias para cerrar otras al abrir una
  private static instances = new Set<ActionsComponent>();
  @Input() actions: ActionType[] = [];
  @Input() disabled = false;
  @Input() prefer: 'auto' | 'up' | 'down' = 'auto';

  open = false;
  direction: 'up' | 'down' = 'down';

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    ActionsComponent.instances.add(this);
  }

  ngOnDestroy() {
    ActionsComponent.instances.delete(this);
  }

  toggle(event: Event) {
    event.stopPropagation();
    if (this.disabled) return;
    const willOpen = !this.open;
    this.open = willOpen;
    if (willOpen) {
      // Cerrar otros menús abiertos
      ActionsComponent.instances.forEach(inst => {
        if (inst !== this && inst.open) inst.close();
      });
      // Esperar render para calcular dirección
      setTimeout(() => this.resolveDirection(), 0);
    }
  }

  private resolveDirection() {
    if (this.prefer !== 'auto') {
      this.direction = this.prefer === 'up' ? 'up' : 'down';
      return;
    }
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const menuEl = this.el.nativeElement.querySelector('[role="menu"]') as HTMLElement | null;
    const menuH = menuEl ? menuEl.getBoundingClientRect().height : this.actions.length * 40 + 8;
    const spaceBelow = viewportH - hostRect.bottom;
    this.direction = spaceBelow < menuH + 8 ? 'up' : 'down';
  }

  onAction(a: ActionType) {
    try { a.handler(); } finally { this.close(); }
  }

  close() { this.open = false; }

  trackAction = (_: number, a: ActionType) => a.label + (a.icon || '');

  @HostListener('document:click', ['$event'])
  onDocClick(ev: Event) {
    if (!this.open) return;
    const target = ev.target as Node;
    if (!this.el.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.open) this.close(); }
}
