import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../core/components/input/input.component';
import { CheckboxComponent } from '../../core/components/checkbox/checkbox.component';
import { AuthService } from '../../core/services/auth.service';

// Mock KPIs
import { DataMock } from '../../core/mocks/data.mock';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    InputComponent,
    CheckboxComponent,
  ],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private data = inject(DataMock);

  // ui state
  loading = false;
  error = '';
  remember = false;

  // KPIs mostrados en el panel izquierdo
  cotizaciones = 0;
  pedidos = 0;

  // form
  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get fc() {
    return this.form.controls;
  }

  constructor() {
    this.dashboardService.getKPIs().subscribe((response) => {
      const kpis = response.data;
      const c = kpis.find((k) => k.key === 'cotizaciones');
      const p = kpis.find((k) => k.key === 'pedidos');
      this.cotizaciones = c?.value ?? 0;
      this.pedidos = p?.value ?? 0;
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { correo, password } = this.form.getRawValue();
    this.authService.login(correo!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (e: Error) => {
        this.loading = false;
        this.error = e.message;
      },
    });
  }
}
