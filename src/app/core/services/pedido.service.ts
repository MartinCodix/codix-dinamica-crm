import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ResponseType } from '../types/response.type';
import { PaginationType } from '../types/pagination.type';
import { PedidoType } from '../types/pedido.type';
import { PedidoDetalleType } from '../types/pedido-detalle.type';
import { CotizacionType } from '../types/cotizacion.type';
import { paginatePedidos, __allPedidos } from '../mocks/pedidos.mock';
import { __allCotizaciones } from '../mocks/cotizaciones.mock';
import { PaginationOptionsType } from '../types/pagination-options';
import { obtenerCotizacionOrigen } from '../utils/cotizacion-pedido.util';

@Injectable({ providedIn: 'root' })
export class PedidoService {
	list = (page: number = 1, pageSize: number = 10, opts: PaginationOptionsType<PedidoType, 'clienteNombre' | 'vendedorNombre'> = {}): Observable<ResponseType<PaginationType<PedidoType>>> => {
		const pageData = paginatePedidos(page, pageSize, opts);
		const response: ResponseType<PaginationType<PedidoType>> = {
			data: pageData,
			status: 'success',
		};
		return of(response).pipe(delay(400));
	}

	read = (id: string): Observable<ResponseType<PedidoType | null>> => {
		const item = __allPedidos.find(p => p.pedidoId === id) || null;
		return of({ status: 'success' as const, data: item }).pipe(delay(300));
	}

	create = (payload: Partial<PedidoType>): Observable<ResponseType<PedidoType>> => {
		// Simulación: generar id y datos base
		const detalles: PedidoDetalleType[] = (payload.detalles && payload.detalles.length ? payload.detalles : [{
			pedidoId: 'tmp',
			tipo: 'RUN RATE' as const,
			numeroContracto: '',
			proveedor: 'PROVEEDOR NUEVO',
			partida: 1,
			sku: '',
			numeroParte: '',
			linea: 'GENERAL',
			cantidad: 1,
			descripcion: 'Producto Nuevo',
			costoOfertadoUnitario: 1000,
			costoTotal: 1000,
			precioVentaUnitario: 1300,
			precioVentaTotal: 1300,
		}]).map((d, i) => ({ ...d, partida: i + 1 }));
		const subtotal = detalles.reduce((acc, d) => acc + d.precioVentaTotal, 0);
		const ivaAl16 = +(subtotal * 0.16).toFixed(2);
		const total = +(subtotal + ivaAl16).toFixed(2);
		const created: PedidoType = {
			pedidoId: 'p' + (Math.floor(Math.random() * 10000) + 1000),
			cliente: payload.cliente!,
			vendedor: payload.vendedor!,
			fecha: payload.fecha || new Date(),
			viaEmbarque: payload.viaEmbarque!,
			usoCFDI: payload.usoCFDI || 'GASTOS EN GENERAL',
			oc: payload.oc || '',
			contrato: payload.contrato || '',
			preciosEn: payload.preciosEn || 'MN',
			tipoCambioDls: payload.tipoCambioDls || 19.38,
			detalles: detalles.map(d => ({ ...d, pedidoId: 'p' + (Math.floor(Math.random() * 10000) + 1000) })),
			subtotal,
			ivaAl16,
			total,
			horarioEntrega: payload.horarioEntrega || '',
			especial: payload.especial || false,
			urgente: payload.urgente || false,
		};
		// Nota: No se inserta realmente al array global, es sólo mock.
		console.log('POST /api/pedidos (mock)', created);
		return of({ status: 'success' as const, data: created }).pipe(delay(500));
	}

	update = (id: string, payload: Partial<PedidoType>): Observable<ResponseType<PedidoType | null>> => {
		console.log('PUT /api/pedidos/' + id + ' (mock)', payload);
		const baseExisting = __allPedidos.find(p => p.pedidoId === id) || null;
		if (!baseExisting) {
			return of({ status: 'success' as const, data: null }).pipe(delay(400));
		}
		// Recalcular importes si se proveen detalles
		let detalles = payload.detalles || baseExisting.detalles;
		if (!detalles.length) detalles = baseExisting.detalles;
		detalles = detalles.map((d, i) => ({ ...d, partida: i + 1 }));
		const subtotal = detalles.reduce((acc, d) => acc + d.precioVentaTotal, 0);
		const ivaAl16 = +(subtotal * 0.16).toFixed(2);
		const total = +(subtotal + ivaAl16).toFixed(2);
		const updated: PedidoType = {
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
		console.log('DELETE /api/pedidos/' + id + ' (mock)');
		return of({ status: 'success' as const, data: null }).pipe(delay(300));
	}

	// Nuevos métodos para manejo de relación con cotizaciones
	obtenerConCotizacion = (id: string): Observable<ResponseType<{ pedido: PedidoType; cotizacion?: CotizacionType } | null>> => {
		const pedido = __allPedidos.find(p => p.pedidoId === id);
		if (!pedido) {
			return of({ status: 'success' as const, data: null }).pipe(delay(300));
		}

		const cotizacion = obtenerCotizacionOrigen(pedido, __allCotizaciones);
		
		return of({ 
			status: 'success' as const, 
			data: { pedido, cotizacion: cotizacion || undefined } 
		}).pipe(delay(300));
	}

	listPorCotizacion = (cotizacionId: string): Observable<ResponseType<PedidoType[]>> => {
		const pedidos = __allPedidos.filter(p => p.cotizacionId === cotizacionId);
		
		return of({ 
			status: 'success' as const, 
			data: pedidos 
		}).pipe(delay(300));
	}

}
