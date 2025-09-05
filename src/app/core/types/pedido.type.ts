import { ClienteType } from './cliente.type';
import { PedidoDetalleType } from './pedido-detalle.type';
import { UsuarioType } from './usuario.type';
import { ViaEmbarqueType } from './via-emabrque.type';

export interface PedidoType {
  pedidoId: string;
  cotizacionId?: string; // Referencia a la cotización origen (opcional para pedidos directos)
  vendedor: UsuarioType;
  fecha: Date;
  cliente: ClienteType;
  viaEmbarque: ViaEmbarqueType;
  usoCFDI: string;
  oc: string;
  contrato: string;
  preciosEn: 'MN' | 'DLS';
  tipoCambioDls: number;
  
  detalles: PedidoDetalleType[];
  subtotal: number;
  ivaAl16: number;
  total: number;
  
  horarioEntrega: string;
  especial: boolean;
  urgente: boolean;
}
