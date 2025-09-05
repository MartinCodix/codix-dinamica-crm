import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '../../core/components/input/input.component';
import { FormComponent } from '../../core/components/form/form.component';
import { ClienteService } from '../../core/services/cliente.service';
import { ClienteType } from '../../core/types/cliente.type';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  standalone: true,
  selector: 'app-cliente',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './cliente.page.html',
})
export class ClientePage implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private clienteService = inject(ClienteService);
  private confirmService = inject(ConfirmService);

  loading = false;
  editing = false;

  types = ['Mayorista', 'Minorista', 'Consultor'];

  form = this.fb.group({
    clienteId: [''],
    clave: [''],
    nombre: ['', Validators.required],
    tipo: ['', Validators.required],
    contacto: [''],
    notas: [''],
    activo: [false],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.editing = true;
        this.get(id);
      } else {
        this.editing = false;
      }
    });
  }

  get = (id: string) => {
    this.loading = true;
    this.clienteService.read(id).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.form.patchValue({
            ...(response.data as ClienteType),
          });
        } else {
          console.warn('[ClientePage] respuesta inesperada', response);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('[ClientePage] error cargando cliente', err);
        this.loading = false;
      },
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
          const value: Partial<ClienteType> = {
            ...this.form.value,
          } as ClienteType;
          if (this.editing && this.form.value.clienteId) {
            this.clienteService
              .update(this.form.value.clienteId, value)
              .subscribe((res) => {
                if (res.status === 'success') this.goBack();
              });
          } else {
            this.clienteService.create(value).subscribe((res) => {
              if (res.status === 'success') this.goBack();
            });
          }
        }
      });
  };

  goBack = () => {
    this.router.navigate(['/clientes']);
  };

  @HostListener('document:keydown.escape')
  onEscape = () => {
    this.goBack();
  };
}
