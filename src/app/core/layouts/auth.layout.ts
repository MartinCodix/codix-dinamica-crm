import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeComponent } from '../components/theme/theme.component';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ThemeComponent],
  templateUrl: './auth.layout.html',
})
export class AuthLayout {
  private service = inject(DashboardService);
  cotizaciones = 0;
  pedidos = 0;

  constructor() {
    this.service.getKPIs().subscribe((response) => {
      const kpis = response.data;
      const c = kpis.find((k) => k.key === 'cotizaciones');
      const p = kpis.find((k) => k.key === 'pedidos');
      this.cotizaciones = c?.value ?? 0;
      this.pedidos = p?.value ?? 0;
    });
  }
}
