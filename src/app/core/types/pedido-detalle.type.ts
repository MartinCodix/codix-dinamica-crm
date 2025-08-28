export interface PedidoDetalleType {
  pedidoId: string;
  tipo: 'RUN RATE' | 'BIG DEAL';
  numeroContracto: string;
  proveedor: string;
  partida: number;
  sku: string;
  numeroParte: string;
  linea: string;
  cantidad: number;
  descripcion: string;
  costoOfertadoUnitario: number;
  costoTotal: number;
  precioVentaUnitario: number;
  precioVentaTotal: number;
}