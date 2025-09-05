import { PedidoType } from '../types/pedido.type';
import { PedidoDetalleType } from '../types/pedido-detalle.type';
import { PaginationOptionsType } from '../types/pagination-options';
import { PaginationType } from '../types/pagination.type';

// Datos base manuales (al menos 1 para ejemplo inicial)
export const base: PedidoType[] = [
  {
    pedidoId: 'p1',
    cotizacionId: 'c1', // Este pedido proviene de la cotización c1
    cliente: {
      clienteId: 'c1',
      clave: 'CLI-001',
      nombre: 'F&P MFG  de México S.A de C.V.',
      tipo: 'INICIATIVA PRIVADA GLOBALES',
      contacto: '+52-462-166-1700',
      notas: '',
      activo: true,
    },
    vendedor: {
      usuarioId: 'u2',
      nombre: 'Ventas',
      correo: 'ventas@dinamica.com',
      password: '*****',
      activo: true,
      fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
      fechaActualizacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      ultimaConexion: new Date(Date.now() - 1000 * 60 * 5),
      enLinea: true,
    },
    fecha: new Date(2025, 7, 28),
    viaEmbarque: {
      viaEmbarqueId: 'v1',
      tipo: 'FORANEA',
      localidades: ['Irapuato', 'Celaya', 'Salamanca', ' Apaseo'],
      frecuencia: ['LUNES', 'MARTES', 'VIERNES'],
    },
    usoCFDI: 'GASTOS EN GENERAL',
    oc: '',
    contrato: '51916',
    preciosEn: 'MN',
    tipoCambioDls: 19.38,
    detalles: [
      {
        pedidoId: 'p1',
        tipo: 'RUN RATE',
        numeroContracto: '',
        proveedor: 'exel mexico',
        partida: 1,
        sku: '010343812598',
        numeroParte: 'ERC-278',
        linea: 'EPSON CONSUMIBLES',
        cantidad: 3,
        descripcion: 'CINTA EPSON TM 290/M290 TM290/TM290ll/TM295 NEGRO',
        costoOfertadoUnitario: 46.27,
        costoTotal: 138.81,
        precioVentaUnitario: 147,
        precioVentaTotal: 441,
      },
    ],
    subtotal: 441,
    ivaAl16: 70.56,
    total: 511.56,
    horarioEntrega: '',
    especial: false,
    urgente: false,
  },
];

// Generación extendida (más realista): múltiples partidas, mezcla MN / DLS
const TOTAL = 70; // más registros para mayor paginación
const extended: PedidoType[] = [...base];

for (let i = base.length + 1; i <= TOTAL; i++) {
  const currency: 'MN' | 'DLS' = i % 4 === 0 ? 'DLS' : 'MN'; // ~25% en dólares
  const tipoCambioDls = currency === 'DLS' ? +(16.4 + (i % 9) * 0.15).toFixed(2) : 19.38; // rango ~16.4 - 17.6

  // Número de partidas 1..5
  const partidas = (i % 5) + 1;
  const detalles: PedidoDetalleType[] = Array.from({ length: partidas }).map((_, idx) => {
    const costoBase = currency === 'DLS' ? +(50 + (i + idx) * 10).toFixed(2) : +(800 + (i + idx) * 150).toFixed(2);
    const margen = 1.3 + (idx * 0.1); // Margen entre 1.3 y 1.7
    const precioVenta = +(costoBase * margen).toFixed(2);
    const cantidad = (idx % 4) + 1;
    
    return {
      pedidoId: `p${i}`,
      tipo: (['RUN RATE', 'BIG DEAL'] as const)[idx % 2],
      numeroContracto: i % 7 === 0 ? `CTR-${i * 100}` : '',
      proveedor: ['EXEL MEXICO', 'INGRAM MICRO', 'TECH DATA', 'GRUPO SOLUTEK'][idx % 4],
      partida: idx + 1,
      sku: `SKU${String(i).padStart(3, '0')}${String(idx + 1).padStart(2, '0')}`,
      numeroParte: `P${i}-${idx + 1}`,
      linea: ['EPSON CONSUMIBLES', 'HP ORIGINALES', 'CANON TONERS', 'LEXMARK SUPPLIES'][idx % 4],
      cantidad,
      descripcion: `Producto ${i}-${idx + 1} - Descripción detallada del insumo`,
      costoOfertadoUnitario: costoBase,
      costoTotal: +(costoBase * cantidad).toFixed(2),
      precioVentaUnitario: precioVenta,
      precioVentaTotal: +(precioVenta * cantidad).toFixed(2),
    };
  });

  const subtotal = +detalles.reduce((acc, d) => acc + d.precioVentaTotal, 0).toFixed(2);
  const ivaAl16 = +(subtotal * 0.16).toFixed(2);
  const total = +(subtotal + ivaAl16).toFixed(2);

  extended.push({
    pedidoId: `p${i}`,
    cotizacionId: i % 7 === 0 ? `c${i}` : undefined, // Algunos pedidos provienen de cotizaciones
    cliente: {
      clienteId: `c${((i - 1) % 40) + 1}`,
      clave: `CLI-${String(((i - 1) % 40) + 1).padStart(3, '0')}`,
      nombre: `Cliente ${((i - 1) % 40) + 1}`,
      tipo: ['INICIATIVA PRIVADA', 'GOBIERNO', 'EMPRESA'][i % 3],
      contacto: `+52-${400 + i}-${100 + i}-${1000 + i}`,
      notas: i % 11 === 0 ? 'Cliente preferencial' : '',
      activo: i % 17 !== 0,
    },
    vendedor: {
      usuarioId: `u${((i - 1) % 5) + 1}`,
      nombre: `Usuario ${((i - 1) % 5) + 1}`,
      correo: `ventas${((i - 1) % 5) + 1}@dinamica.com`,
      password: '*****',
      activo: true,
      fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * (5 + (i % 40))),
      fechaActualizacion: new Date(Date.now() - 1000 * 60 * (i % 600)),
      ultimaConexion: new Date(Date.now() - 1000 * 60 * (i % 240)),
      enLinea: i % 3 === 0,
    },
    fecha: new Date(2025, i % 12, ((i * 3) % 28) + 1),
    viaEmbarque: {
      viaEmbarqueId: `v${((i - 1) % 3) + 1}`,
      tipo: (['FORANEA', 'LOCAL'] as const)[i % 2],
      localidades: [
        ['Irapuato', 'Celaya', 'Salamanca'],
        ['León', 'Guanajuato'],
        ['Querétaro', 'San Juan del Río']
      ][i % 3],
      frecuencia: [
        ['LUNES', 'MIERCOLES', 'VIERNES'],
        ['MARTES', 'JUEVES'],
        ['DIARIO']
      ][i % 3],
    },
    usoCFDI: ['GASTOS EN GENERAL', 'EQUIPO DE COMPUTO', 'PAPELERIA'][i % 3],
    oc: i % 6 === 0 ? `OC-${i * 50}` : '',
    contrato: i % 4 === 0 ? `${50000 + i}` : '',
    preciosEn: currency,
    tipoCambioDls,
    detalles,
    subtotal,
    ivaAl16,
    total,
    horarioEntrega: i % 5 === 0 ? '8:00 - 12:00' : i % 5 === 1 ? '13:00 - 17:00' : '',
    especial: i % 8 === 0,
    urgente: i % 12 === 0,
  });
}

// Claves de ordenamiento extendidas para campos derivados
export type PedidoSortKey = keyof PedidoType | 'clienteNombre' | 'vendedorNombre';

export const paginatePedidos = (
  page: number = 1,
  pageSize: number = 10,
  options: PaginationOptionsType<PedidoType, 'clienteNombre' | 'vendedorNombre'> = {}
): PaginationType<PedidoType> => {
  let list = [...extended];
  const { search, sortBy, sortDir = 'asc', filters, sorts } = options;

  // Filtros
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        list = list.filter(item => {
          const itemValue = (item as any)[key];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(String(value).toLowerCase());
          }
          return itemValue === value;
        });
      }
    });
  }

  // Búsqueda
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    list = list.filter(item =>
      item.cliente.nombre.toLowerCase().includes(searchLower) ||
      item.vendedor.nombre.toLowerCase().includes(searchLower) ||
      item.pedidoId.toLowerCase().includes(searchLower) ||
      item.oc.toLowerCase().includes(searchLower) ||
      item.contrato.toLowerCase().includes(searchLower) ||
      item.detalles.some(d => 
        d.descripcion.toLowerCase().includes(searchLower) ||
        d.sku.toLowerCase().includes(searchLower) ||
        d.numeroParte.toLowerCase().includes(searchLower)
      )
    );
  }

  // Ordenamiento
  const effectiveSorts: { key: PedidoSortKey; dir: 'asc' | 'desc' }[] =
    sorts && sorts.length
      ? sorts
      : sortBy
      ? [{ key: sortBy, dir: sortDir }]
      : [];

  if (effectiveSorts.length) {
    list.sort((a, b) => {
      for (const { key, dir } of effectiveSorts) {
        let aVal: any, bVal: any;

        switch (key) {
          case 'clienteNombre':
            aVal = a.cliente.nombre;
            bVal = b.cliente.nombre;
            break;
          case 'vendedorNombre':
            aVal = a.vendedor.nombre;
            bVal = b.vendedor.nombre;
            break;
          default:
            aVal = (a as any)[key];
            bVal = (b as any)[key];
        }

        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Paginación
  if (pageSize <= 0) pageSize = 10;
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  page = Math.min(Math.max(1, page), totalPages);
  const offset = (page - 1) * pageSize;
  const slice = list.slice(offset, offset + pageSize);
  const pageItemCount = slice.length;
  const from = total === 0 ? 0 : offset + 1;
  const to = offset + pageItemCount;
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return {
    items: slice,
    total,
    page,
    pageSize,
    totalPages,
    pageItemCount,
    from,
    to,
    offset,
    hasPrevious,
    hasNext,
    previousPage: hasPrevious ? page - 1 : null,
    nextPage: hasNext ? page + 1 : null,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
  };
};

// Exportación de todos los datos simulados
export const __allPedidos = extended;
