import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '../../core/components/input/input.component';
import { ClienteService } from '../../core/services/cliente.service';
import { ClienteType } from '../../core/types/cliente.type';
import { HeaderComponent } from '../../core/components/header/header.component';
import { CheckboxComponent } from '../../core/components/checkbox/checkbox.component';

@Component({
	standalone: true,
	selector: 'app-cliente',
	imports: [CommonModule, ReactiveFormsModule, InputComponent, HeaderComponent, CheckboxComponent],
	templateUrl: './cliente.page.html'
})
export class ClientePage implements OnInit {
	private fb = inject(FormBuilder);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private service = inject(ClienteService);

	loading = false;
	submitting = false;
	editing = false;
	id: string | null = null;

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

	get f() { return this.form.controls; }

	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
		if (this.id && this.id !== 'nuevo') {
			this.editing = true;
			this.load(this.id);
		}
	}

	load(id: string) {
		this.loading = true;
		this.service.get(id).subscribe(res => {
			if (res.status === 'success' && res.data) {
				const c = res.data as ClienteType;
				this.form.patchValue(c);
			}
			this.loading = false;
		});
	}

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		this.submitting = true;
			const { clienteId, ...rest } = this.form.value;
			const value: Partial<ClienteType> = {
				...rest,
				clave: rest.clave || undefined as any,
				nombre: rest.nombre || '',
				tipo: rest.tipo || '',
				contacto: rest.contacto || '',
				notas: rest.notas || undefined,
				activo: rest.activo ?? true,
			} as any;
		if (this.editing && this.id) {
			this.service.update(this.id, value).subscribe(res => {
				this.submitting = false;
				if (res.status === 'success') this.back();
			});
		} else {
			this.service.create(value).subscribe(res => {
				this.submitting = false;
				if (res.status === 'success') this.back();
			});
		}
	}

	back() { this.router.navigate(['/clientes']); }
}
