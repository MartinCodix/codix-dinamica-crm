import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '../../core/components/input/input.component';
import { ClienteService } from '../../core/services/cliente.service';
import { ClienteType } from '../../core/types/cliente.type';
import { HeaderComponent } from '../../core/components/header/header.component';
import { CotizacionService } from '../../core/services/cotizacion.service';
import { CotizacionType } from '../../core/types/cotizacion.type';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioType } from '../../core/types/usuario.type';
import { CotizacionDetalleType } from '../../core/types/cotizacion-detalle.type';
// Eliminado flujo rxjs avanzado para simplificar búsqueda
import { BanxicoService } from '../../core/services/banxico.service';
import { FormComponent } from '../../core/components/form/form.component';

@Component({
  standalone: true,
  selector: 'app-cotizacion',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
    HeaderComponent,
    FormComponent,
  ],
  templateUrl: './cotizacion.page.html',
})
export class CotizacionPage implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(CotizacionService);

  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);
  private banxicoService = inject(BanxicoService);

  loading = false;
  submitting = false;
  editing = false;
  id: string | null = null;

  clientes: ClienteType[] = [];
  usuarios: UsuarioType[] = [];

  // Typeahead state (simplificado)
  searchCliente = '';
  isLoadingCliente = false;
  showPanelCliente = false;
  selectedCliente: ClienteType | null = null;

  searchUsuario = '';
  atencionLoading = false;
  showAtencionPanel = false;
  selectedAtencion: UsuarioType | null = null;

  // Tamaño por defecto para buscar resultados (consistente con otros módulos)
  private readonly pageSize = 10;

  formasPago: CotizacionType['formaPago'][] = [
    'CREDITO',
    'EFECTIVO',
    'TRANSFERENCIA',
  ];
  tiemposEntrega: CotizacionType['tiempoEntrega'][] = [
    '3 - 5 días',
    '5 - 7 días',
    '7 - 10 días',
  ];
  monedas: CotizacionType['preciosEn'][] = ['MN', 'DLS'];

  // Tipo de cambio sugerido (Banxico)
  suggestedTipoCambio: number | null = null;

  form = this.fb.group({
    cotizacionId: [''],
    numero: [null as number | null, [Validators.min(1)]],
    clienteId: ['', Validators.required],
    atencionId: ['', Validators.required],
    fecha: [new Date().toISOString().substring(0, 10), Validators.required], // ISO date string for input date
    condicionesEspeciales: [''],
    telefonoRq: [''],
    fechaVigencia: [
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)
        .toISOString()
        .substring(0, 10),
      Validators.required,
    ],
    formaPago: ['CREDITO' as CotizacionType['formaPago'], Validators.required],
    tiempoEntrega: [
      '3 - 5 días' as CotizacionType['tiempoEntrega'],
      Validators.required,
    ],
    preciosEn: ['MN' as CotizacionType['preciosEn'], Validators.required],
    tipoCambio: [0, [Validators.min(0)]],
    detalles: this.fb.array<FormGroup>([]),
    notas: [''],
  });

  // Helper para detalle
  detalleControl = (group: any, name: string) => group.get(name);

  ngOnInit() {
    this.clienteService.list(1, 200).subscribe((r) => {
      if (r.status === 'success' && r.data) this.clientes = r.data.items;
    });

    this.usuarioService.list(1, 200).subscribe((r) => {
      if (r.status === 'success' && r.data) this.usuarios = r.data.items;
    });

    if (this.form.controls.detalles.length === 0) this.addDetalle();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'nueva') {
      this.editing = true;
      this.get(this.id);
    }
    // Cambio de moneda
    this.form.get('preciosEn')?.valueChanges.subscribe((v) => {
      const tc = this.form.get('tipoCambio');
      if (v === 'MN') {
        this.suggestedTipoCambio = null;
        tc?.disable({ emitEvent: false });
        tc?.setValue(0, { emitEvent: false });
      } else if (v === 'DLS') {
        if (tc?.disabled) tc.enable({ emitEvent: false });
        this.fetchTipoCambio();
      }
    });
    // Inicial
    const tipoCambio = this.form.get('preciosEn')?.value;
    if (tipoCambio === 'MN')
      this.form.get('tipoCambio')?.disable({ emitEvent: false });
    if (tipoCambio === 'DLS') this.fetchTipoCambio();

    // No streams: las búsquedas se disparan mediante listClientes / listUsuarios
  }

  get = (id: string) => {
    this.loading = true;
    this.service.read(id).subscribe((res: any) => {
      if (res.status === 'success' && res.data) {
        const c = res.data as CotizacionType;
        // patch fundamentals
        this.form.patchValue({
          cotizacionId: c.cotizacionId,
          numero: c.numero,
          clienteId: c.cliente.clienteId,
          atencionId: c.atencion.usuarioId,
          // Backend manejará normalización: usamos string YYYY-MM-DD directo
          fecha: (typeof c.fecha === 'string'
            ? c.fecha
            : new Date(c.fecha).toISOString()
          ).substring(0, 10),
          condicionesEspeciales: c.condicionesEspeciales,
          telefonoRq: c.telefonoRq,
          fechaVigencia: (typeof c.fechaVigencia === 'string'
            ? c.fechaVigencia
            : new Date(c.fechaVigencia).toISOString()
          ).substring(0, 10),
          formaPago: c.formaPago,
          tiempoEntrega: c.tiempoEntrega,
          preciosEn: c.preciosEn,
          tipoCambio: c.tipoCambio,
          notas: c.notas,
        });
        this.selectedCliente = c.cliente;
        this.searchCliente = c.cliente.nombre;
        this.selectedAtencion = c.atencion;
        this.searchUsuario = c.atencion.nombre;
        // detalles
        this.form.controls.detalles.clear();
        c.detalles.forEach((d) =>
          this.form.controls.detalles.controls.push(
            this.fb.group({
              cantidad: this.fb.control<number>(d.cantidad),
              descripcion: this.fb.control<string>(d.descripcion, {
                validators: Validators.required,
              }),
              precioLista: this.fb.control<number>(d.precioLista),
              descuento: this.fb.control<number>(d.descuento),
            })
          )
        );
      }
      this.loading = false;
    });
  };

  buildDetalle = (d?: Partial<CotizacionDetalleType>): FormGroup =>
    this.fb.group({
      cantidad: this.fb.control<number>(d?.cantidad ?? 1),
      descripcion: this.fb.control<string>(d?.descripcion ?? '', {
        validators: Validators.required,
      }),
      precioLista: this.fb.control<number>(d?.precioLista ?? 0),
      descuento: this.fb.control<number>(d?.descuento ?? 0),
    });

  addDetalle = () =>
    this.form.controls.detalles.push(
      this.fb.group({
        cantidad: this.fb.control<number>(1),
        descripcion: this.fb.control<string>('', {
          validators: Validators.required,
        }),
        precioLista: this.fb.control<number>(0),
        descuento: this.fb.control<number>(0),
      })
    );
  removeDetalle = (i: number) => {
    if (this.form.controls.detalles.length > 1)
      this.form.controls.detalles.removeAt(i);
  };

  linePrecioUnit = (i: number): number => {
    const g = this.form.controls.detalles.at(i);
    if (!g) return 0;
    const precioLista = Number(g.get('precioLista')?.value) || 0;
    const desc = Number(g.get('descuento')?.value) || 0;
    return +(precioLista * (1 - desc)).toFixed(2);
  };
  lineSubtotal = (i: number): number => {
    const g = this.form.controls.detalles.at(i);
    if (!g) return 0;
    const cantidad = Number(g.get('cantidad')?.value) || 0;
    return +(this.linePrecioUnit(i) * cantidad).toFixed(2);
  };
  lineIva = (i: number): number => +(this.lineSubtotal(i) * 0.16).toFixed(2);
  lineTotal = (i: number): number =>
    +(this.lineSubtotal(i) + this.lineIva(i)).toFixed(2);

  get subtotal(): number {
    return this.form.controls.detalles.controls.reduce(
      (a, _, i) => a + this.lineSubtotal(i),
      0
    );
  }
  get ivaAl16(): number {
    return +(this.subtotal * 0.16).toFixed(2);
  }
  get total(): number {
    return +(this.subtotal + this.ivaAl16).toFixed(2);
  }

  submit = () => {
    if (this.form.invalid || this.form.controls.detalles.length === 0) {
      this.form.markAllAsTouched();
      this.form.controls.detalles.controls.forEach((c) => c.markAllAsTouched());
      return;
    }
    this.submitting = true;
    const v = this.form.value;
    const cliente = this.clientes.find((c) => c.clienteId === v.clienteId)!;
    const atencion = this.usuarios.find((u) => u.usuarioId === v.atencionId)!;
    const detalles: CotizacionDetalleType[] =
      this.form.controls.detalles.controls.map((c, i) => ({
        cotizacionId: v.cotizacionId || 'tmp',
        partida: i + 1,
        cantidad: Number(c.get('cantidad')?.value) || 0,
        descripcion: c.get('descripcion')?.value || '',
        precioLista: Number(c.get('precioLista')?.value) || 0,
        descuento: Number(c.get('descuento')?.value) || 0,
        precioUnitario: this.linePrecioUnit(i),
        precioTotal: this.lineSubtotal(i),
      }));
    const payload: Partial<CotizacionType> = {
      numero: v.numero || undefined,
      cliente,
      atencion,
      // Enviamos string plano (backend normaliza)
      fecha: v.fecha! as any,
      condicionesEspeciales: v.condicionesEspeciales || '',
      telefonoRq: v.telefonoRq || '',
      fechaVigencia: v.fechaVigencia! as any,
      formaPago: v.formaPago!,
      tiempoEntrega: v.tiempoEntrega!,
      preciosEn: v.preciosEn!,
      tipoCambio: v.preciosEn === 'DLS' ? Number(v.tipoCambio) || 0 : 0,
      detalles,
      subtotal: this.subtotal,
      ivaAl16: this.ivaAl16,
      total: this.total,
      notas: v.notas || '',
    };
    const obs: any =
      this.editing && this.id
        ? this.service.update(this.id, payload)
        : this.service.create(payload);
    obs.subscribe((r: any) => {
      this.submitting = false;
      if (r.status === 'success') this.back();
    });
  };

  back = () => this.router.navigate(['/cotizaciones']);

  // Typeahead handlers
  // Listado clientes (similar patrón a otros módulos)
  listClientes = (page: number = 1, pageSize: number = this.pageSize) => {
    const term = this.searchCliente?.trim();
    if (!term || term.length < 2) {
      this.clientes = [];
      this.showPanelCliente = false;
      return;
    }
    this.isLoadingCliente = true;
    this.showPanelCliente = true;
    this.clienteService
      .list(page, pageSize, { search: term })
      .subscribe((res) => {
        if (res.status === 'success' && res.data)
          this.clientes = res.data.items;
        else this.clientes = [];
        this.isLoadingCliente = false;
      });
  };

  onSearchCliente = (term: string) => {
    this.searchCliente = term;
    this.form.get('clienteId')?.setValue('');
    this.selectedCliente = null;
    this.listClientes();
  };
  pickCliente = (c: ClienteType) => {
    this.selectedCliente = c;
    this.searchCliente = c.nombre;
    this.form.get('clienteId')?.setValue(c.clienteId);
    this.showPanelCliente = false;
  };
  clearCliente = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    this.selectedCliente = null;
    this.searchCliente = '';
    this.form.get('clienteId')?.setValue('');
    this.clientes = [];
  };

  listUsuarios = (page: number = 1, pageSize: number = this.pageSize) => {
    const term = this.searchUsuario?.trim();
    if (!term || term.length < 2) {
      this.usuarios = [];
      this.showAtencionPanel = false;
      return;
    }
    this.atencionLoading = true;
    this.showAtencionPanel = true;
    this.usuarioService
      .list(page, pageSize, { search: term })
      .subscribe((res) => {
        if (res.status === 'success' && res.data)
          this.usuarios = res.data.items;
        else this.usuarios = [];
        this.atencionLoading = false;
      });
  };

  onSearchUsuario = (term: string) => {
    this.searchUsuario = term;
    this.form.get('atencionId')?.setValue('');
    this.selectedAtencion = null;
    this.listUsuarios();
  };
  pickAtencion = (u: UsuarioType) => {
    this.selectedAtencion = u;
    this.searchUsuario = u.nombre;
    this.form.get('atencionId')?.setValue(u.usuarioId);
    this.showAtencionPanel = false;
  };
  clearAtencion = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    this.selectedAtencion = null;
    this.searchUsuario = '';
    this.form.get('atencionId')?.setValue('');
  };

  private fetchTipoCambio = () => {
    this.banxicoService.get().subscribe((rate) => {
      this.suggestedTipoCambio = rate;
      const tc = this.form.get('tipoCambio');
      if (rate && tc && (!this.editing || !tc.value || tc.value === 0)) {
        tc.setValue(rate, { emitEvent: false });
      }
    });
  };

  applySuggestedTipoCambio = () => {
    if (this.suggestedTipoCambio)
      this.form.get('tipoCambio')?.setValue(this.suggestedTipoCambio);
  };

  // trackBy helpers for performance in typeahead lists
  trackByCliente = (_i: number, c: ClienteType) => c.clienteId;
  trackByAtencion = (_i: number, u: UsuarioType) => u.usuarioId;
  trackByDetalle = (i: number, _ctrl: any) => i;

  @HostListener('document:click') closePanels() {
    this.showPanelCliente = false;
    this.showAtencionPanel = false;
  }

  @HostListener('document:keydown.escape')
  onEscape = () => {
    this.router.navigate(['/cotizaciones']);
  };
  stopClick = (e: MouseEvent) => e.stopPropagation();
}
