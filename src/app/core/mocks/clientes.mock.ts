import { ClienteType } from '../types/cliente.type';
import { PaginationType } from '../types/pagination.type';

// Base manual de 20 clientes iniciales para variedad de datos
export const base: ClienteType[] = [
  {
    clienteId: 'c1',
    clave: 'CLI-001',
    nombre: 'Tecnologías León',
    tipo: 'Mayorista',
    contacto: 'Carlos Pérez',
    notas: 'Cliente clave',
    activo: true,
  },
  {
    clienteId: 'c2',
    clave: 'CLI-002',
    nombre: 'Sistemas Bajío',
    tipo: 'Minorista',
    contacto: 'María López',
    activo: true,
  },
  {
    clienteId: 'c3',
    clave: 'CLI-003',
    nombre: 'Soluciones Integrales',
    tipo: 'Mayorista',
    contacto: 'Luis García',
    notas: 'Cliente VIP',
    activo: true,
  },
  {
    clienteId: 'c4',
    clave: 'CLI-004',
    nombre: 'Innovaciones Tech',
    tipo: 'Mayorista',
    contacto: 'Ana Torres',
    notas: 'Cliente preferente',
    activo: true,
  },
  {
    clienteId: 'c5',
    clave: 'CLI-005',
    nombre: 'Consultoría Avanzada',
    tipo: 'Consultor',
    contacto: 'Pedro Martínez',
    notas: 'Cliente estratégico',
    activo: true,
  },
  {
    clienteId: 'c6',
    clave: 'CLI-006',
    nombre: 'Desarrollo Web',
    tipo: 'Consultor',
    contacto: 'Laura Gómez',
    notas: 'Cliente en crecimiento',
    activo: false,
  },
  {
    clienteId: 'c7',
    clave: 'CLI-007',
    nombre: 'Redes Globales',
    tipo: 'Mayorista',
    contacto: 'Javier Ruiz',
    activo: true,
  },
  {
    clienteId: 'c8',
    clave: 'CLI-008',
    nombre: 'Data Analytics Pro',
    tipo: 'Consultor',
    contacto: 'Sofía Herrera',
    notas: 'Interesado en upgrade',
    activo: true,
  },
  {
    clienteId: 'c9',
    clave: 'CLI-009',
    nombre: 'Cloud & DevOps',
    tipo: 'Consultor',
    contacto: 'Diego Molina',
    activo: true,
  },
  {
    clienteId: 'c10',
    clave: 'CLI-010',
    nombre: 'ERP Solutions',
    tipo: 'Mayorista',
    contacto: 'Elena Castro',
    notas: 'Pago pendiente',
    activo: true,
  },
  {
    clienteId: 'c11',
    clave: 'CLI-011',
    nombre: 'Mobile First',
    tipo: 'Minorista',
    contacto: 'Andrés Ortega',
    activo: true,
  },
  {
    clienteId: 'c12',
    clave: 'CLI-012',
    nombre: 'Ciberseguridad MX',
    tipo: 'Consultor',
    contacto: 'Valeria Núñez',
    notas: 'Revisión trimestral',
    activo: true,
  },
  {
    clienteId: 'c13',
    clave: 'CLI-013',
    nombre: 'Retail Digital',
    tipo: 'Minorista',
    contacto: 'Gabriela Flores',
    activo: false,
  },
  {
    clienteId: 'c14',
    clave: 'CLI-014',
    nombre: 'IA & Machine Learning',
    tipo: 'Consultor',
    contacto: 'Rodrigo Chávez',
    notas: 'Alta prioridad',
    activo: true,
  },
  {
    clienteId: 'c15',
    clave: 'CLI-015',
    nombre: 'Finanzas 360',
    tipo: 'Mayorista',
    contacto: 'Marta Delgado',
    activo: true,
  },
  {
    clienteId: 'c16',
    clave: 'CLI-016',
    nombre: 'Talent Cloud',
    tipo: 'Minorista',
    contacto: 'Héctor Salas',
    activo: true,
  },
  {
    clienteId: 'c17',
    clave: 'CLI-017',
    nombre: 'Logística Just-In-Time',
    tipo: 'Mayorista',
    contacto: 'Beatriz Ríos',
    activo: true,
  },
  {
    clienteId: 'c18',
    clave: 'CLI-018',
    nombre: 'E-Commerce Express',
    tipo: 'Minorista',
    contacto: 'Pablo Campos',
    notas: 'Soporte extendido',
    activo: true,
  },
  {
    clienteId: 'c19',
    clave: 'CLI-019',
    nombre: 'Smart Automation',
    tipo: 'Consultor',
    contacto: 'Isabel Moreno',
    activo: true,
  },
  {
    clienteId: 'c20',
    clave: 'CLI-020',
    nombre: 'Blockchain Services',
    tipo: 'Consultor',
    contacto: 'Fernando Vega',
    notas: 'Evaluar PoC',
    activo: true,
  },
];

// Generación extra automática hasta, por ejemplo, 87 clientes totales para varias páginas
const TOTAL = 87;
const types = ['Mayorista', 'Minorista', 'Consultor'];
const extended: ClienteType[] = [...base];
for (let i = base.length + 1; i <= TOTAL; i++) {
  extended.push({
    clienteId: `c${i}`,
    clave: `CLI-${String(i).padStart(3, '0')}`,
    nombre: `Cliente Simulado ${i}`,
    tipo: types[i % types.length],
    contacto: `Contacto ${i}`,
    notas: i % 10 === 0 ? 'Revisión pendiente' : undefined,
    activo: i % 7 !== 0, // algunos inactivos
  });
}

// Función de paginación simulada
export interface PaginateCustomerOptions {
  search?: string;
  sortBy?: keyof ClienteType;
  sortDir?: 'asc' | 'desc';
  filters?: Partial<Record<keyof ClienteType, any>>;
}

export function paginateCustomers(
  page: number = 1,
  pageSize: number = 10,
  options: PaginateCustomerOptions = {}
): PaginationType<ClienteType> {
  let list = [...extended];
  const { search, sortBy, sortDir = 'asc', filters } = options;

  if (filters) {
    list = list.filter(c =>
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
    list = list.filter(c =>
      [c.clienteId, c.clave, c.nombre, c.tipo, c.contacto]
        .filter(Boolean)
        .some(val => val!.toString().toLowerCase().includes(q))
    );
  }

  if (sortBy) {
    list.sort((a: any, b: any) => {
      let av = a[sortBy];
      let bv = b[sortBy];
      if (av == null && bv != null) return sortDir === 'asc' ? -1 : 1;
      if (av != null && bv == null) return sortDir === 'asc' ? 1 : -1;
      if (av == null && bv == null) return 0;
      if (typeof av === 'string' && typeof bv === 'string') {
        const cmp = av.localeCompare(bv, 'es', { sensitivity: 'base' });
        return sortDir === 'asc' ? cmp : -cmp;
      }
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
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

export const __allCustomers = extended; // opcional para debugging
