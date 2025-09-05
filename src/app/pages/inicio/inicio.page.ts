import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  standalone: true,
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  imports: [CommonModule, DecimalPipe, HeaderComponent],
})
export class InicioPage {
  private service = inject(DashboardService);
  kpis = signal([] as any[]);
  series = signal({ labels: [], quotes: [], orders: [] } as any);
  constructor() {
    this.service
      .getKPIs()
      .subscribe((response) => this.kpis.set(response.data));
  }
}
