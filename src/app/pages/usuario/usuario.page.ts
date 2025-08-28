import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '../../core/components/input/input.component';
import { HeaderComponent } from '../../core/components/header/header.component';
import { CheckboxComponent } from '../../core/components/checkbox/checkbox.component';
import { UsuarioType } from '../../core/types/usuario.type';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  standalone: true,
  selector: 'app-usuario',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    HeaderComponent,
    CheckboxComponent,
  ],
  templateUrl: './usuario.page.html',
})
export class UsuarioPage implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(UsuarioService);

  loading = false;
  saving = false;
  edit = false;
  id: string | null = null;

  // Validator compacto
  private static passwordConfirmation(
    g: AbstractControl
  ): ValidationErrors | null {
    const p = g.get('password')?.value || '';
    const c = g.get('confirmarPassword')?.value || '';
    if (!p && !c) return null; // no cambio
    if (!p || !c) return { pwIncomplete: true };
    if (p !== c) return { pwMismatch: true };
    return null;
  }

  form = this.fb.group(
    {
      usuarioId: [''],
      nombre: ['', Validators.required],
      password: ['', [Validators.minLength(6)]],
      confirmarPassword: [''],
      activo: [false],
    },
    { validators: UsuarioPage.passwordConfirmation }
  );

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'nuevo') {
      this.edit = true;
      this.load(this.id);
    } else {
      this.setPasswordRules();
    }
  }

  private setPasswordRules() {
    const p = this.form.get('password');
    const c = this.form.get('confirmarPassword');
    if (!p || !c) return;
    if (this.edit) {
      p.setValidators([Validators.minLength(6)]);
      c.setValidators([]);
    } else {
      p.setValidators([Validators.required, Validators.minLength(6)]);
      c.setValidators([Validators.required]);
    }
    p.updateValueAndValidity({ emitEvent: false });
    c.updateValueAndValidity({ emitEvent: false });
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  private load(id: string) {
    this.loading = true;
    this.api.get(id).subscribe((res) => {
      if (res.status === 'success' && res.data) {
        const u = res.data as UsuarioType;
        this.form.patchValue({
          usuarioId: (u as any).usuarioId || (u as any).id || id,
          nombre: (u as any).nombre || (u as any).name || '',
          password: '',
          confirmarPassword: '',
          activo: (u as any).activo ?? (u as any).active ?? true,
        });
      }
      this.setPasswordRules();
      this.loading = false;
    });
  }

  passwordMessage(): string {
    if (this.form.hasError('pwIncomplete')) return 'Complete ambos campos';
    if (this.form.hasError('pwMismatch')) return 'No coinciden';
    return '';
  }

  passwordInvalid(): boolean {
    return (
      !!this.passwordMessage() ||
      (this.f.password.touched && this.f.password.invalid)
    );
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const { usuarioId, password, confirmarPassword, ...rest } = this.form
      .value as any;
    const payload: any = {
      ...rest,
      nombre: rest.nombre || '',
      activo: rest.activo ?? true,
    };
    if (password && confirmarPassword && !this.form.errors)
      payload.password = password;
    const obs =
      this.edit && this.id
        ? this.api.update(this.id, payload)
        : this.api.create(payload);
    obs.subscribe((r) => {
      this.saving = false;
      if (r.status === 'success') this.back();
    });
  }

  back() {
    this.router.navigate(['/usuarios']);
  }
}
