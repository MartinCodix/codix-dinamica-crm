import { Component, HostListener, inject, OnInit } from '@angular/core';
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
import { FormComponent } from '../../core/components/form/form.component';
import { UsuarioType } from '../../core/types/usuario.type';
import { UsuarioService } from '../../core/services/usuario.service';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  standalone: true,
  selector: 'app-usuario',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './usuario.page.html',
})
export class UsuarioPage implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private usuarioService = inject(UsuarioService);
  private confirmService = inject(ConfirmService);

  loading = false;
  editing = false;
  error = '';

  form = this.fb.group(
    {
      usuarioId: [''],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmarPassword: [''],
      activo: [false],
    },
    {
      validators: (g: AbstractControl): ValidationErrors | null => {
        const password = g.get('password')?.value || '';
        const confirmPassword = g.get('confirmarPassword')?.value || '';
        if (!password && !confirmPassword) return null; // no cambio
        if (!password || !confirmPassword) return { incomplete: true };
        if (password !== confirmPassword) return { mismatch: true };
        return null;
      },
    }
  );

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.editing = true;
        this.get(id);
      }

      const password = this.form.get('password');
      const confirmPassword = this.form.get('confirmarPassword');

      if (!password || !confirmPassword) return;

      if (this.editing) {
        password.setValidators([Validators.minLength(6)]);
        confirmPassword.setValidators([]);
      } else {
        password.setValidators([Validators.required, Validators.minLength(6)]);
        confirmPassword.setValidators([Validators.required]);
      }

      password.updateValueAndValidity({ emitEvent: false });
      confirmPassword.updateValueAndValidity({ emitEvent: false });

      this.form.updateValueAndValidity({ emitEvent: false });
    });
  }

  get = (id: string) => {
    this.loading = true;
    this.usuarioService.get(id).subscribe((response) => {
      if (response.status === 'success' && response.data) {
        const usuario = response.data as UsuarioType;
        this.form.patchValue({
          ...usuario,
        });
      }
      this.loading = false;
    });
  };

  onSubmit = async () => {
    this.confirmService
      .ask({
        header: `${this.editing ? 'Actualizar' : 'Crear nuevo'} cliente`,
        message: `¿Seguro que deseas ${
          this.editing ? 'actualizar este' : 'crear un nuevo'
        } cliente?`,
        acceptLabel: `Sí, ${this.editing ? 'actualizar' : 'crear'}`,
        rejectLabel: 'No, cancelar',
        iconClass: 'pi pi-exclamation-triangle',
        color: 'blue',
      })
      .then((ok) => {
        if (ok) {
          if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
          }
          const value: Partial<UsuarioType> = {
            ...this.form.value,
          } as UsuarioType;
          if (this.editing && this.form.value.usuarioId) {
            this.usuarioService
              .update(this.form.value.usuarioId, value)
              .subscribe((res) => {
                if (res.status === 'success') this.goBack();
              });
          } else {
            this.usuarioService.create(value).subscribe((res) => {
              if (res.status === 'success') this.goBack();
            });
          }
        }
      });
  };

  confirmPassword = (): boolean => {
    this.error = '';
    if (this.form.hasError('incomplete')) this.error = 'Complete ambos campos';
    if (this.form.hasError('mismatch')) this.error = 'No coinciden';
    return (
      !!this.error &&
      this.form.controls.password.touched &&
      this.form.controls.password.invalid
    );
  };

  goBack() {
    this.router.navigate(['/usuarios']);
  }

  @HostListener('document:keydown.escape')
  escape = () => {
    this.goBack();
  };
}
