import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ResponseType } from '../types/response.type';
import { PaginationType } from '../types/pagination.type';
import { CotizacionType } from '../types/cotizacion.type';
import { PedidoType } from '../types/pedido.type';
import { paginateCotizaciones, __allCotizaciones } from '../mocks/cotizaciones.mock';
import { CotizacionDetalleType } from '../types/cotizacion-detalle.type';
import { PaginationOptionsType } from '../types/pagination-options';
import { convertirCotizacionAPedido, puedeConvertirseAPedido } from '../utils/cotizacion-pedido.util';

@Injectable({ providedIn: 'root' })
export class CotizacionService {
	list = (page: number = 1, pageSize: number = 10, opts: PaginationOptionsType<CotizacionType, 'clienteNombre' | 'atencionNombre'> = {}): Observable<ResponseType<PaginationType<CotizacionType>>> => {
		const pageData = paginateCotizaciones(page, pageSize, opts);
		const response: ResponseType<PaginationType<CotizacionType>> = {
			data: pageData,
			status: 'success',
		};
		return of(response).pipe(delay(400));
	}

	read = (id: string): Observable<ResponseType<CotizacionType | null>> => {
		const item = __allCotizaciones.find(c => c.cotizacionId === id) || null;
		return of({ status: 'success' as const, data: item }).pipe(delay(300));
	}

	create = (payload: Partial<CotizacionType>): Observable<ResponseType<CotizacionType>> => {
		// Simulación: generar id y número correlativo base mock
		const numero = 400000 + Math.floor(Math.random() * 50000);
		const detalles: CotizacionDetalleType[] = (payload.detalles && payload.detalles.length ? payload.detalles : [{
			cotizacionId: 'tmp',
			partida: 1,
			cantidad: 1,
			descripcion: 'Producto Nuevo',
			sku: '',
			precioLista: 1000,
			descuento: 0,
			precioUnitario: 1000,
			precioTotal: 1000,
		}]).map((d, i) => ({ ...d, partida: i + 1 }));
		const subtotal = detalles.reduce((acc, d) => acc + d.precioTotal, 0);
		const ivaAl16 = +(subtotal * 0.16).toFixed(2);
		const total = +(subtotal + ivaAl16).toFixed(2);
		const created: CotizacionType = {
			cotizacionId: 'c' + (Math.floor(Math.random() * 10000) + 1000),
			numero,
			cliente: payload.cliente!,
			atencion: payload.atencion!,
			fecha: payload.fecha || new Date(),
			condicionesEspeciales: payload.condicionesEspeciales || '',
			telefonoRq: payload.telefonoRq || '',
			fechaVigencia: payload.fechaVigencia || new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
			formaPago: payload.formaPago || 'CREDITO',
			tiempoEntrega: payload.tiempoEntrega || '3 - 5 días',
			preciosEn: payload.preciosEn || 'MN',
			tipoCambio: payload.tipoCambio || 0,
			detalles: detalles.map(d => ({ ...d })),
			subtotal,
			ivaAl16,
			total,
			notas: payload.notas || '',
			estado: 'BORRADOR',
			pedidoId: undefined
		};
		// Nota: No se inserta realmente al array global, es sólo mock.
		console.log('POST /api/cotizaciones (mock)', created);
		return of({ status: 'success' as const, data: created }).pipe(delay(500));
	}

	update = (id: string, payload: Partial<CotizacionType>): Observable<ResponseType<CotizacionType | null>> => {
		console.log('PUT /api/cotizaciones/' + id + ' (mock)', payload);
		const baseExisting = __allCotizaciones.find(c => c.cotizacionId === id) || null;
		if (!baseExisting) {
			return of({ status: 'success' as const, data: null }).pipe(delay(400));
		}
		// Recalcular importes si se proveen detalles
		let detalles = payload.detalles || baseExisting.detalles;
		if (!detalles.length) detalles = baseExisting.detalles;
		detalles = detalles.map((d, i) => ({ ...d, partida: i + 1 }));
		const subtotal = detalles.reduce((acc, d) => acc + d.precioTotal, 0);
		const ivaAl16 = +(subtotal * 0.16).toFixed(2);
		const total = +(subtotal + ivaAl16).toFixed(2);
		const updated: CotizacionType = {
			...baseExisting,
			...payload,
			detalles,
			subtotal,
			ivaAl16,
			total,
		};
		return of({ status: 'success' as const, data: updated }).pipe(delay(500));
	}

	delete = (id: string): Observable<ResponseType<null>> => {
		console.log('DELETE /api/cotizaciones/' + id + ' (mock)');
		return of({ status: 'success' as const, data: null }).pipe(delay(300));
	}

	// Nuevos métodos para manejo de conversión a pedidos
	convertirAPedido = (cotizacionId: string, opciones: {
		viaEmbarqueId?: string;
		usoCFDI?: string;
		oc?: string;
		contrato?: string;
		horarioEntrega?: string;
		especial?: boolean;
		urgente?: boolean;
	} = {}): Observable<ResponseType<{ cotizacion: CotizacionType; pedido: PedidoType } | null>> => {
		console.log('POST /api/cotizaciones/' + cotizacionId + '/convertir-pedido (mock)', opciones);
		
		const cotizacion = __allCotizaciones.find(c => c.cotizacionId === cotizacionId);
		if (!cotizacion || !puedeConvertirseAPedido(cotizacion)) {
			return of({ status: 'success' as const, data: null }).pipe(delay(300));
		}

		// Generar pedido desde cotización
		const pedido = convertirCotizacionAPedido(cotizacion, opciones);
		
		// Actualizar cotización con estado CONVERTIDA y referencia al pedido
		const cotizacionActualizada: CotizacionType = {
			...cotizacion,
			estado: 'CONVERTIDA',
			pedidoId: pedido.pedidoId
		};

		return of({ 
			status: 'success' as const, 
			data: { cotizacion: cotizacionActualizada, pedido } 
		}).pipe(delay(500));
	}

	cambiarEstado = (id: string, nuevoEstado: CotizacionType['estado']): Observable<ResponseType<CotizacionType | null>> => {
		console.log('PATCH /api/cotizaciones/' + id + '/estado (mock)', { estado: nuevoEstado });
		
		const cotizacion = __allCotizaciones.find(c => c.cotizacionId === id);
		if (!cotizacion) {
			return of({ status: 'success' as const, data: null }).pipe(delay(300));
		}

		const cotizacionActualizada: CotizacionType = {
			...cotizacion,
			estado: nuevoEstado
		};

		return of({ status: 'success' as const, data: cotizacionActualizada }).pipe(delay(400));
	}

	verificarConvertible = (id: string): Observable<ResponseType<{ convertible: boolean; razon?: string }>> => {
		const cotizacion = __allCotizaciones.find(c => c.cotizacionId === id);
		if (!cotizacion) {
			return of({ 
				status: 'success' as const, 
				data: { convertible: false, razon: 'Cotización no encontrada' } 
			}).pipe(delay(200));
		}

		const convertible = puedeConvertirseAPedido(cotizacion);
		const razon = !convertible 
			? cotizacion.estado === 'CONVERTIDA' 
				? 'Ya fue convertida a pedido'
				: `Estado actual: ${cotizacion.estado}. Solo se pueden convertir cotizaciones APROBADAS`
			: undefined;

		return of({ 
			status: 'success' as const, 
			data: { convertible, razon } 
		}).pipe(delay(200));
	}

}
