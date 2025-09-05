import { UsuarioType } from '../types/usuario.type';
import { PaginationType } from '../types/pagination.type';
import { PaginationOptionsType } from '../types/pagination-options';

// Base manual con variedad (emails, estados, online/offline, etc.)
export const base: UsuarioType[] = [
  {
    usuarioId: 'u1',
    nombre: 'Demo Usuario',
    correo: 'demo@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(),
    enLinea: true,
  },
  {
    usuarioId: 'u2',
    nombre: 'Ventas',
    correo: 'ventas@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 5),
    enLinea: true,
  },
  {
    usuarioId: 'u3',
    nombre: 'Soporte',
    correo: 'soporte@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 55),
    enLinea: false,
  },
  {
    usuarioId: 'u4',
    nombre: 'Finanzas',
    correo: 'finanzas@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 15),
    enLinea: true,
  },
  {
    usuarioId: 'u5',
    nombre: 'Marketing',
    correo: 'marketing@dinamica.com',
    password: 'Dinamica123',
    activo: false,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 60 * 2),
    enLinea: false,
  },
  {
    usuarioId: 'u6',
    nombre: 'Compras',
    correo: 'compras@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 20),
    enLinea: false,
  },
  {
    usuarioId: 'u7',
    nombre: 'Logística',
    correo: 'logistica@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 8),
    enLinea: true,
  },
  {
    usuarioId: 'u8',
    nombre: 'Recursos Humanos',
    correo: 'rrhh@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 60 * 5),
    enLinea: false,
  },
  {
    usuarioId: 'u9',
    nombre: 'Proyectos',
    correo: 'proyectos@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 2),
    enLinea: true,
  },
  {
    usuarioId: 'u10',
    nombre: 'Auditoría',
    correo: 'auditoria@dinamica.com',
    password: 'Dinamica123',
    activo: true,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    fechaActualizacion: new Date(),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 60 * 12),
    enLinea: false,
  },
];

// Generación automática adicional (ajusta TOTAL según necesidad de pruebas)
const TOTAL = 180; // por ejemplo 180 usuarios
const extended: UsuarioType[] = [...base];

for (let i = base.length + 1; i <= TOTAL; i++) {
  const createdOffsetDays = 5 + (i % 90); // fechas variadas
  const updatedOffsetMinutes = i % 300;
  const lastTimeOffsetMinutes = (i * 7) % 1440; // dentro del último día
  extended.push({
    usuarioId: `u${i}`,
    nombre: `Usuario ${i}`,
    correo: `usuario${i}@dinamica.com`,
    password: 'Dinamica123',
    activo: i % 11 !== 0, // algunos inactivos
    fechaCreacion: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * createdOffsetDays
    ),
    fechaActualizacion: new Date(Date.now() - 1000 * 60 * updatedOffsetMinutes),
    ultimaConexion: new Date(Date.now() - 1000 * 60 * lastTimeOffsetMinutes),
    enLinea: i % 5 === 0 ? false : i % 3 === 0, // patrón mixto
  });
}

export const paginateUsers = (
  page: number = 1,
  pageSize: number = 10,
  options: PaginationOptionsType<UsuarioType> = {}
): PaginationType<UsuarioType> => {
  let list = [...extended];

  const { search, sortBy, sortDir = 'asc', filters, sorts } = options;

  // Filtros exactos
  if (filters) {
    list = list.filter((u) =>
      Object.entries(filters).every(([k, v]) => {
        if (v === undefined || v === null || v === '') return true;
        const value: any = (u as any)[k];
        if (value === undefined || value === null) return false;
        if (typeof value === 'string' && typeof v === 'string') {
          return value.toLowerCase() === v.toLowerCase();
        }
        return value === v;
      })
    );
  }

  // Búsqueda textual simple en campos string principales
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((u) =>
      [u.usuarioId, u.nombre, u.correo]
        .filter(Boolean)
        .some((val) => val!.toString().toLowerCase().includes(q))
    );
  }

  // Ordenamiento múltiple (prioridad según orden en arreglo 'sorts')
  const effectiveSorts: { key: keyof UsuarioType; dir: 'asc' | 'desc' }[] =
    sorts && sorts.length
      ? sorts
      : sortBy
      ? [{ key: sortBy, dir: sortDir }]
      : [];

  if (effectiveSorts.length) {
    list.sort((a: any, b: any) => {
      for (const s of effectiveSorts) {
        let av = a[s.key];
        let bv = b[s.key];
        if (av instanceof Date) av = av.getTime();
        if (bv instanceof Date) bv = bv.getTime();
        if (typeof av === 'boolean') av = av ? 1 : 0;
        if (typeof bv === 'boolean') bv = bv ? 1 : 0;
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
};

// Exportaciones para compatibilidad y debugging
export const data = base; // mantiene el export original (primeros usuarios base)
export const __allUsers = extended; // todos los usuarios simulados
