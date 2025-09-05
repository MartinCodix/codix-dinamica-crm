import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputComponent } from '../../core/components/input/input.component';
import { HeaderComponent } from '../../core/components/header/header.component';

import { PedidoService } from '../../core/services/pedido.service';
import { ClienteService } from '../../core/services/cliente.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { BanxicoService } from '../../core/services/banxico.service';

import { PedidoType } from '../../core/types/pedido.type';
import { PedidoDetalleType } from '../../core/types/pedido-detalle.type';
import { ClienteType } from '../../core/types/cliente.type';
import { UsuarioType } from '../../core/types/usuario.type';
import { ViaEmbarqueType } from '../../core/types/via-emabrque.type';
import { FormComponent } from '../../core/components/form/form.component';

@Component({
  standalone: true,
  selector: 'app-pedido',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
    HeaderComponent,
    FormComponent,
  ],
  templateUrl: './pedido.page.html',
})
export class PedidoPage implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(PedidoService);

  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);
  private banxicoService = inject(BanxicoService);

  loading = false;
  submitting = false;
  editing = false;
  id: string | null = null;

  clientes: ClienteType[] = [];
  usuarios: UsuarioType[] = [];
  viaEmbarques: ViaEmbarqueType[] = [
    {
      viaEmbarqueId: 'v1',
      tipo: 'FORANEA',
      localidades: ['Irapuato', 'Celaya', 'Salamanca', 'Apaseo'],
      frecuencia: ['LUNES', 'MARTES', 'VIERNES'],
    },
    {
      viaEmbarqueId: 'v2',
      tipo: 'LOCAL',
      localidades: ['León', 'Guanajuato'],
      frecuencia: ['MARTES', 'JUEVES'],
    },
  ];

  // Typeahead state
  searchCliente = '';
  isLoadingCliente = false;
  showPanelCliente = false;
  selectedCliente: ClienteType | null = null;

  searchVendedor = '';
  vendedorLoading = false;
  showVendedorPanel = false;
  selectedVendedor: UsuarioType | null = null;

  // Tamaño por defecto para buscar resultados
  private readonly pageSize = 10;

  usosCFDI: PedidoType['usoCFDI'][] = [
    'GASTOS EN GENERAL',
    'EQUIPO DE COMPUTO',
    'PAPELERIA',
  ];
  monedas: PedidoType['preciosEn'][] = ['MN', 'DLS'];

  // Opciones para los selects
  get viaEmbarqueOptions() {
    return this.viaEmbarques.map(v => ({ 
      value: v.viaEmbarqueId, 
      label: `${v.tipo} - ${v.localidades.join(', ')}` 
    }));
  }

  get usoCFDIOptions() {
    return this.usosCFDI.map(u => ({ value: u, label: u }));
  }

  get monedaOptions() {
    return this.monedas.map(m => ({ 
      value: m, 
      label: m === 'MN' ? 'Pesos MXN' : 'Dólares USD' 
    }));
  }

  // Tipo de cambio sugerido (Banxico)
  suggestedTipoCambio: number | null = null;

  form = this.fb.group({
    pedidoId: [''],
    clienteId: ['', Validators.required],
    vendedorId: ['', Validators.required],
    fecha: [new Date().toISOString().substring(0, 10), Validators.required],
    viaEmbarqueId: ['', Validators.required],
    usoCFDI: ['GASTOS EN GENERAL' as PedidoType['usoCFDI'], Validators.required],
    oc: [''],
    contrato: [''],
    preciosEn: ['MN' as PedidoType['preciosEn'], Validators.required],
    tipoCambioDls: [19.38, [Validators.min(0)]],
    detalles: this.fb.array<FormGroup>([]),
    horarioEntrega: [''],
    especial: [false],
    urgente: [false],
  });

  ngOnInit() {
    this.clienteService.list(1, 200).subscribe((r) => {
      if (r.status === 'success' && r.data?.items) {
        this.clientes = r.data.items;
      }
    });

    this.usuarioService.list(1, 200).subscribe((r) => {
      if (r.status === 'success' && r.data?.items) {
        this.usuarios = r.data.items;
      }
    });

    if (this.form.controls.detalles.length === 0) this.addDetalle();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'nuevo') {
      this.editing = true;
      this.get(this.id);
    }

    // Cambio de moneda
    this.form.get('preciosEn')?.valueChanges.subscribe((v) => {
      if (v === 'MN') {
        this.form.get('tipoCambioDls')?.disable({ emitEvent: false });
        this.form.get('tipoCambioDls')?.setValue(19.38);
      } else {
        this.form.get('tipoCambioDls')?.enable({ emitEvent: false });
        this.fetchTipoCambio();
      }
    });

    // Inicial
    const tipoCambio = this.form.get('preciosEn')?.value;
    if (tipoCambio === 'MN')
      this.form.get('tipoCambioDls')?.disable({ emitEvent: false });
    if (tipoCambio === 'DLS') this.fetchTipoCambio();
  }

  get = (id: string) => {
    this.loading = true;
    this.service.read(id).subscribe((res: any) => {
      this.loading = false;
      if (res.status === 'success' && res.data) {
        const pedido = res.data as PedidoType;
        
        // Configurar datos del formulario
        this.form.patchValue({
          pedidoId: pedido.pedidoId,
          clienteId: pedido.cliente.clienteId,
          vendedorId: pedido.vendedor.usuarioId,
          fecha: pedido.fecha.toISOString().substring(0, 10),
          viaEmbarqueId: pedido.viaEmbarque.viaEmbarqueId,
          usoCFDI: pedido.usoCFDI,
          oc: pedido.oc,
          contrato: pedido.contrato,
          preciosEn: pedido.preciosEn,
          tipoCambioDls: pedido.tipoCambioDls,
          horarioEntrega: pedido.horarioEntrega,
          especial: pedido.especial,
          urgente: pedido.urgente,
        });

        // Configurar cliente seleccionado
        this.selectedCliente = pedido.cliente;
        this.searchCliente = pedido.cliente.nombre;

        // Configurar vendedor seleccionado
        this.selectedVendedor = pedido.vendedor;
        this.searchVendedor = pedido.vendedor.nombre;

        // Limpiar detalles existentes y agregar los del pedido
        this.form.controls.detalles.clear();
        pedido.detalles.forEach((detalle) => {
          this.form.controls.detalles.push(this.buildDetalle(detalle));
        });
      }
    });
  };

  buildDetalle = (d?: Partial<PedidoDetalleType>): FormGroup =>
    this.fb.group({
      tipo: this.fb.control<PedidoDetalleType['tipo']>(d?.tipo ?? 'RUN RATE', { validators: Validators.required }),
      numeroContracto: this.fb.control<string>(d?.numeroContracto ?? ''),
      proveedor: this.fb.control<string>(d?.proveedor ?? '', { validators: Validators.required }),
      sku: this.fb.control<string>(d?.sku ?? ''),
      numeroParte: this.fb.control<string>(d?.numeroParte ?? ''),
      linea: this.fb.control<string>(d?.linea ?? '', { validators: Validators.required }),
      cantidad: this.fb.control<number>(d?.cantidad ?? 1, { validators: [Validators.required, Validators.min(1)] }),
      descripcion: this.fb.control<string>(d?.descripcion ?? '', { validators: Validators.required }),
      costoOfertadoUnitario: this.fb.control<number>(d?.costoOfertadoUnitario ?? 0, { validators: [Validators.required, Validators.min(0)] }),
      precioVentaUnitario: this.fb.control<number>(d?.precioVentaUnitario ?? 0, { validators: [Validators.required, Validators.min(0)] }),
    });

  addDetalle = () =>
    this.form.controls.detalles.push(
      this.fb.group({
        tipo: this.fb.control<PedidoDetalleType['tipo']>('RUN RATE', { validators: Validators.required }),
        numeroContracto: this.fb.control<string>(''),
        proveedor: this.fb.control<string>('', { validators: Validators.required }),
        sku: this.fb.control<string>(''),
        numeroParte: this.fb.control<string>(''),
        linea: this.fb.control<string>('', { validators: Validators.required }),
        cantidad: this.fb.control<number>(1, { validators: [Validators.required, Validators.min(1)] }),
        descripcion: this.fb.control<string>('', { validators: Validators.required }),
        costoOfertadoUnitario: this.fb.control<number>(0, { validators: [Validators.required, Validators.min(0)] }),
        precioVentaUnitario: this.fb.control<number>(0, { validators: [Validators.required, Validators.min(0)] }),
      })
    );

  removeDetalle = (i: number) => {
    if (this.form.controls.detalles.length > 1)
      this.form.controls.detalles.removeAt(i);
  };

  lineCostoTotal = (i: number): number => {
    const g = this.form.controls.detalles.at(i);
    if (!g) return 0;
    const costo = Number(g.get('costoOfertadoUnitario')?.value) || 0;
    const cantidad = Number(g.get('cantidad')?.value) || 0;
    return +(costo * cantidad).toFixed(2);
  };

  linePrecioTotal = (i: number): number => {
    const g = this.form.controls.detalles.at(i);
    if (!g) return 0;
    const precio = Number(g.get('precioVentaUnitario')?.value) || 0;
    const cantidad = Number(g.get('cantidad')?.value) || 0;
    return +(precio * cantidad).toFixed(2);
  };

  get subtotal(): number {
    return this.form.controls.detalles.controls.reduce((acc, g) => {
      const precio = Number(g.get('precioVentaUnitario')?.value) || 0;
      const cantidad = Number(g.get('cantidad')?.value) || 0;
      return acc + (precio * cantidad);
    }, 0);
  }

  get ivaAl16(): number {
    return +(this.subtotal * 0.16).toFixed(2);
  }

  get total(): number {
    return +(this.subtotal + this.ivaAl16).toFixed(2);
  }

  submit = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.form.value;

    const detalles: PedidoDetalleType[] = formValue.detalles!.map((d: any, i: number) => ({
      pedidoId: this.id || 'temp',
      tipo: d.tipo,
      numeroContracto: d.numeroContracto,
      proveedor: d.proveedor,
      partida: i + 1,
      sku: d.sku,
      numeroParte: d.numeroParte,
      linea: d.linea,
      cantidad: d.cantidad,
      descripcion: d.descripcion,
      costoOfertadoUnitario: d.costoOfertadoUnitario,
      costoTotal: d.costoOfertadoUnitario * d.cantidad,
      precioVentaUnitario: d.precioVentaUnitario,
      precioVentaTotal: d.precioVentaUnitario * d.cantidad,
    }));

    const payload: Partial<PedidoType> = {
      cliente: this.selectedCliente!,
      vendedor: this.selectedVendedor!,
      fecha: new Date(formValue.fecha!),
      viaEmbarque: this.viaEmbarques.find(v => v.viaEmbarqueId === formValue.viaEmbarqueId)!,
      usoCFDI: formValue.usoCFDI!,
      oc: formValue.oc!,
      contrato: formValue.contrato!,
      preciosEn: formValue.preciosEn!,
      tipoCambioDls: formValue.tipoCambioDls!,
      detalles,
      horarioEntrega: formValue.horarioEntrega!,
      especial: formValue.especial!,
      urgente: formValue.urgente!,
    };

    const operation = this.editing
      ? this.service.update(this.id!, payload)
      : this.service.create(payload);

    operation.subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.status === 'success') {
          this.back();
        }
      },
      error: () => {
        this.submitting = false;
      },
    });
  };

  back = () => this.router.navigate(['/pedidos']);

  // Typeahead handlers para clientes
  listClientes = (page: number = 1, pageSize: number = this.pageSize) => {
    this.isLoadingCliente = true;
    this.clienteService.list(page, pageSize, {
      search: this.searchCliente || undefined,
    }).subscribe({
      next: (r) => {
        this.isLoadingCliente = false;
        if (r.status === 'success' && r.data?.items) {
          this.clientes = r.data.items;
          this.showPanelCliente = this.clientes.length > 0;
        }
      },
      error: () => {
        this.isLoadingCliente = false;
      },
    });
  };

  onSearchCliente = (term: string) => {
    this.searchCliente = term;
    if (term.length >= 2) {
      this.listClientes();
    } else {
      this.showPanelCliente = false;
    }
  };

  pickCliente = (c: ClienteType) => {
    this.selectedCliente = c;
    this.form.get('clienteId')?.setValue(c.clienteId);
    this.searchCliente = c.nombre;
    this.showPanelCliente = false;
  };

  clearCliente = (e?: MouseEvent) => {
    e?.stopPropagation();
    this.selectedCliente = null;
    this.form.get('clienteId')?.setValue('');
    this.searchCliente = '';
    this.showPanelCliente = false;
  };

  // Typeahead handlers para vendedores
  listUsuarios = (page: number = 1, pageSize: number = this.pageSize) => {
    this.vendedorLoading = true;
    this.usuarioService.list(page, pageSize, {
      search: this.searchVendedor || undefined,
    }).subscribe({
      next: (r) => {
        this.vendedorLoading = false;
        if (r.status === 'success' && r.data?.items) {
          this.usuarios = r.data.items;
          this.showVendedorPanel = this.usuarios.length > 0;
        }
      },
      error: () => {
        this.vendedorLoading = false;
      },
    });
  };

  onSearchVendedor = (term: string) => {
    this.searchVendedor = term;
    if (term.length >= 2) {
      this.listUsuarios();
    } else {
      this.showVendedorPanel = false;
    }
  };

  pickVendedor = (u: UsuarioType) => {
    this.selectedVendedor = u;
    this.form.get('vendedorId')?.setValue(u.usuarioId);
    this.searchVendedor = u.nombre;
    this.showVendedorPanel = false;
  };

  clearVendedor = (e?: MouseEvent) => {
    e?.stopPropagation();
    this.selectedVendedor = null;
    this.form.get('vendedorId')?.setValue('');
    this.searchVendedor = '';
    this.showVendedorPanel = false;
  };

  private fetchTipoCambio = () => {
    // Simulamos la obtención del tipo de cambio
    // En una implementación real, se llamaría al servicio de Banxico
    setTimeout(() => {
      this.suggestedTipoCambio = 19.50 + Math.random() * 2; // Simulamos un rango
    }, 500);
  };

  applySuggestedTipoCambio = () => {
    if (this.suggestedTipoCambio) {
      this.form.get('tipoCambioDls')?.setValue(this.suggestedTipoCambio);
    }
  };

  // trackBy helpers for performance
  trackByCliente = (_i: number, c: ClienteType) => c.clienteId;
  trackByVendedor = (_i: number, u: UsuarioType) => u.usuarioId;
  trackByDetalle = (i: number, _ctrl: any) => i;

  @HostListener('document:click') closePanels() {
    this.showPanelCliente = false;
    this.showVendedorPanel = false;
  }

  @HostListener('document:keydown.escape')
  onEscape = () => {
    this.showPanelCliente = false;
    this.showVendedorPanel = false;
  };

  stopClick = (e: MouseEvent) => e.stopPropagation();
}
