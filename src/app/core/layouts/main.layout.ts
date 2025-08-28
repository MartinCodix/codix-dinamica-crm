import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { AuthStore } from '../stores/auth.store';
import { ThemeComponent } from '../components/theme/theme.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ConfirmComponent, ThemeComponent],
  templateUrl: './main.layout.html',
})
export class MainLayout {
  public auth = inject(AuthStore);
  private router = inject(Router);
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
