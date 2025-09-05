import { ClienteType } from './cliente.type';
import { CotizacionDetalleType } from './cotizacion-detalle.type';
import { PedidoType } from './pedido.type';
import { UsuarioType } from './usuario.type';

export interface CotizacionType {
  cotizacionId: string;
  numero: number;
  cliente: ClienteType;
  atencion: UsuarioType;
  fecha: Date;
  condicionesEspeciales: string;
  telefonoRq: string;
  fechaVigencia: Date;
  formaPago: 'CREDITO' | 'EFECTIVO' | 'TRANSFERENCIA';
  tiempoEntrega: '3 - 5 días' | '5 - 7 días' | '7 - 10 días';
  preciosEn: 'MN' | 'DLS';
  tipoCambio: number;
  detalles: CotizacionDetalleType[];
  subtotal: number;
  ivaAl16: number;
  total: number;
  notas: string;

  // Relación con pedidos y estado de la cotización
  estado: 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'RECHAZADA' | 'CONVERTIDA' | 'VENCIDA';
  pedidoId?: string; // ID del pedido generado (si se convirtió)
}
