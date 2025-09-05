import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ConfirmService } from '../../services/confirm.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);

  collapsed = true; // initial collapsed "dock" state

  expandTimeout = 600; // delay while hovering before expanding
  collapseTimeout = 300; // delay after leaving before collapsing

  private expandTimer?: number;
  private collapseTimer?: number;

  // Hover handlers
  onEnter = () => {
    window.clearTimeout(this.collapseTimer);
    if (!this.collapsed) return; // already expanded
    this.expandTimer = window.setTimeout(() => {
      this.collapsed = false;
    }, this.expandTimeout);
  };

  onLeave = () => {
    window.clearTimeout(this.expandTimer);
    if (this.collapsed) return; // already collapsed
    window.clearTimeout(this.collapseTimer);
    this.collapseTimer = window.setTimeout(() => {
      this.collapsed = true;
    }, this.collapseTimeout);
  };

  ngOnDestroy = (): void => {
    window.clearTimeout(this.expandTimer);
    window.clearTimeout(this.collapseTimer);
  };

  logout = async () => {
    await this.confirm
      .ask({
        color: 'yellow',
        header: 'Cerrar sesión',
        message: '¿Seguro que deseas salir de tu cuenta?',
        acceptLabel: 'Salir',
        rejectLabel: 'Cancelar',
        iconClass: 'pi pi-exclamation-triangle',
      })
      .then((ok) => {
        if (ok)
          this.auth.logout().subscribe({
            next: () => {
              this.router.navigateByUrl('/login');
            },
          });
      });
  };
}
