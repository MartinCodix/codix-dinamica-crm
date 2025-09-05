import { CotizacionType } from '../types/cotizacion.type';
import { PaginationOptionsType } from '../types/pagination-options';
import { PaginationType } from '../types/pagination.type';

// Datos base manuales (al menos 1 para ejemplo inicial)
export const base: CotizacionType[] = [
  {
    cotizacionId: 'c1',
    numero: 448829,
    cliente: {
      clienteId: 'c1',
      clave: 'CLI-001',
      nombre: 'HAL MÉXICO',
      tipo: 'INICIATIVA PRIVADA GLOBALES',
      contacto:
        'Circuito Mexiamora Pte. No. 182\
Parque Industrial Santa Fe\
Puerto Interior, Silao, Gto. México 36275\
Tel: (01 472) 748 9001',
      notas: 'Cliente clave',
      activo: true,
    },
    atencion: {
      usuarioId: 'u1',
      nombre: 'Martha Cecilia Díaz Romero',
      correo: 'cdiaz@dinamica.com',
      password: '*****',
      activo: true,
      fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      fechaActualizacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      ultimaConexion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      enLinea: true,
    },
    fecha: new Date(2025, 7, 21),
    condicionesEspeciales: '',
    telefonoRq: '',
    fechaVigencia: new Date(2025, 1, 28),
    formaPago: 'CREDITO',
    tiempoEntrega: '3 - 5 días',
    preciosEn: 'MN',
    tipoCambio: 0,
    detalles: [
      {
        cotizacionId: 'c1',
        partida: 1,
        cantidad: 10,
        descripcion: '21M8000VLM',
        precioLista: 22498.75,
        descuento: 0.2,
        precioUnitario: 18799,
        precioTotal: 187990,
      },
    ],
    subtotal: 187990,
    ivaAl16: 30078.4,
    total: 218068.4,
    notas:
      'Portátil - Lenovo ThinkPad E14 Gen 6 21M8000VLM 35.6cm (14") - WUXGA - Intel Core Ultra 7 155H - 16GB - 512GB SSD - Español Teclado - Negro - Intel Chip - 1920 x 1200 - Windows 11 Pro - Intel Arc Graphics - Tecnología conmutación en el mismo plano (In-plane Switching, IPS) - Cámara Frontal/Cámara Web - IEEE 802.11ax Wireless LAN Standard',
    estado: 'CONVERTIDA',
    pedidoId: 'p1', // Esta cotización se convirtió en pedido p1
  },
];

// Generación extendida (más realista): múltiples partidas, mezcla MN / DLS, descuentos variados
const TOTAL = 70; // más registros para mayor paginación
const extended: CotizacionType[] = [...base];
for (let i = base.length + 1; i <= TOTAL; i++) {
  const numero = 450000 + i * 17;
  const currency: 'MN' | 'DLS' = i % 4 === 0 ? 'DLS' : 'MN'; // ~25% en dólares
  const tipoCambio =
    currency === 'DLS' ? +(16.4 + (i % 9) * 0.15).toFixed(2) : 0; // rango ~16.4 - 17.6

  // Número de partidas 1..5
  const partidas = (i % 5) + 1;
  const detalles = Array.from({ length: partidas }).map((_, idx) => {
    const basePrecio = 800 + ((i + idx) % 15) * 180; // variación
    const descuento = ((i + idx) % 6) * 0.03; // 0% a 15% escalonado
    const cantidad = ((i + 2 * idx) % 9) + 1; // 1..9
    const precioLista = +basePrecio.toFixed(2);
    const precioUnitario = +(precioLista * (1 - descuento)).toFixed(2);
    const precioTotal = +(precioUnitario * cantidad).toFixed(2);
    return {
      cotizacionId: `c${i}`,
      partida: idx + 1,
      cantidad,
      descripcion: `Producto ${i}-${idx + 1}`,
      precioLista,
      descuento,
      precioUnitario,
      precioTotal,
    };
  });

  const subtotal = +detalles
    .reduce((acc, d) => acc + d.precioTotal, 0)
    .toFixed(2);
  const ivaAl16 = +(subtotal * 0.16).toFixed(2);
  const total = +(subtotal + ivaAl16).toFixed(2);

  extended.push({
    cotizacionId: `c${i}`,
    numero,
    cliente: {
      clienteId: `c${((i - 1) % 40) + 1}`,
      clave: `CLI-${String(((i - 1) % 40) + 1).padStart(3, '0')}`,
      nombre: `Cliente Simulado ${((i - 1) % 40) + 1}`,
      tipo: ['Mayorista', 'Minorista', 'Consultor'][i % 3],
      contacto: `Contacto ${i}`,
      notas: i % 11 === 0 ? 'Cliente notable' : undefined,
      activo: i % 17 !== 0,
    },
    atencion: {
      usuarioId: 'u1',
      nombre: `Usuario Simulado ${((i - 1) % 40) + 1}`,
      correo: 'demo@dinamica.com',
      password: '*****',
      activo: true,
      fechaCreacion: new Date(
        Date.now() - 1000 * 60 * 60 * 24 * (5 + (i % 40))
      ),
      fechaActualizacion: new Date(Date.now() - 1000 * 60 * (i % 600)),
      ultimaConexion: new Date(Date.now() - 1000 * 60 * (i % 240)),
      enLinea: i % 3 === 0,
    },
    fecha: new Date(2025, i % 12, ((i * 3) % 28) + 1),
    condicionesEspeciales: i % 9 === 0 ? 'Precio sujeto a disponibilidad' : '',
    telefonoRq: '',
    fechaVigencia: new Date(2025, (i + 1) % 12, ((i + 5) % 28) + 1),
    formaPago:
      i % 4 === 0
        ? 'TRANSFERENCIA'
        : i % 4 === 1
        ? 'CREDITO'
        : i % 4 === 2
        ? 'EFECTIVO'
        : 'CREDITO',
    tiempoEntrega:
      i % 3 === 0 ? '3 - 5 días' : i % 3 === 1 ? '5 - 7 días' : '7 - 10 días',
    preciosEn: currency,
    tipoCambio,
    detalles,
    subtotal,
    ivaAl16,
    total,
    notas:
      i % 8 === 0
        ? 'Requiere aprobación gerencia'
        : i % 6 === 0
        ? 'Observación de ejemplo'
        : '',
    estado: i % 7 === 0 
      ? 'CONVERTIDA' 
      : i % 6 === 0 
        ? 'APROBADA' 
        : i % 8 === 0 
          ? 'RECHAZADA' 
          : i % 10 === 0 
            ? 'VENCIDA' 
            : i % 4 === 0 
              ? 'ENVIADA' 
              : 'BORRADOR',
    pedidoId: i % 7 === 0 ? `p${i}` : undefined, // Algunas cotizaciones tienen pedido asociado
  });
}

// Claves de ordenamiento extendidas para campos derivados
export type CotizacionSortKey =
  | keyof CotizacionType
  | 'clienteNombre'
  | 'atencionNombre';

export const paginateCotizaciones = (
  page: number = 1,
  pageSize: number = 10,
  options: PaginationOptionsType<CotizacionType, 'clienteNombre' | 'atencionNombre'> = {}
): PaginationType<CotizacionType> => {
  let list = [...extended];
  const { search, sortBy, sortDir = 'asc', filters, sorts } = options;

  if (filters) {
    list = list.filter((c) =>
      Object.entries(filters).every(([k, v]) => {
        if (v === undefined || v === null || v === '') return true;
        const value: any = (c as any)[k];
        if (value === undefined || value === null) return false;
        if (typeof value === 'string' && typeof v === 'string') {
          return value.toLowerCase() === v.toLowerCase();
        }
        return value === v;
      })
    );
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((c) =>
      [
        c.cotizacionId,
        c.numero?.toString(),
        c.cliente?.nombre,
        c.cliente?.clave,
        c.atencion?.nombre,
        c.notas,
        ...c.detalles.map((d) => d.descripcion),
      ]
        .filter(Boolean)
        .some((val) => val!.toString().toLowerCase().includes(q))
    );
  }

  const effectiveSorts: { key: CotizacionSortKey; dir: 'asc' | 'desc' }[] =
    sorts && sorts.length
      ? sorts
      : sortBy
      ? [{ key: sortBy, dir: sortDir }]
      : [];

  if (effectiveSorts.length) {
    const valueOf = (c: CotizacionType, key: CotizacionSortKey): any => {
      switch (key) {
        case 'clienteNombre':
          return c.cliente?.nombre ?? '';
        case 'atencionNombre':
          return c.atencion?.nombre ?? '';
        default:
          return (c as any)[key];
      }
    };
    list.sort((a: CotizacionType, b: CotizacionType) => {
      for (const s of effectiveSorts) {
        let av = valueOf(a, s.key);
        let bv = valueOf(b, s.key);
        if (av instanceof Date) av = av.getTime();
        if (bv instanceof Date) bv = bv.getTime();
        if (av == null && bv != null) return s.dir === 'asc' ? -1 : 1;
        if (av != null && bv == null) return s.dir === 'asc' ? 1 : -1;
        if (av == null && bv == null) continue;
        if (typeof av === 'string' && typeof bv === 'string') {
          const cmp = av.localeCompare(bv, 'es', { sensitivity: 'base' });
          if (cmp !== 0) return s.dir === 'asc' ? cmp : -cmp;
        } else if (av > bv) return s.dir === 'asc' ? 1 : -1;
        else if (av < bv) return s.dir === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

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
}

// Exportación de todos los datos simulados
export const __allCotizaciones = extended;
