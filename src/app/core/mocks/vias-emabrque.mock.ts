import { PaginationType } from '../types/pagination.type';
import { ViaEmbarqueType } from '../types/via-emabrque.type';

export const base: ViaEmbarqueType[] = [
  {
    viaEmbarqueId: 'v1',
    tipo: 'FORANEA',
    localidades: ['Irapuato', 'Celaya', 'Salamanca', ' Apaseo'],
    frecuencia: ['LUNES', 'MARTES', 'VIERNES'],
  },
  {
    viaEmbarqueId: 'v2',
    tipo: 'FORANEA',
    localidades: ['Querétaro'],
    frecuencia: ['MIERCOLES'],
  },
  {
    viaEmbarqueId: 'v3',
    tipo: 'FORANEA',
    localidades: ['San Miguel de Allende'],
    frecuencia: ['LUNES'],
  },
  {
    viaEmbarqueId: 'v4',
    tipo: 'FORANEA',
    localidades: ['Dolores'],
    frecuencia: ['VIERNES'],
  },
  {
    viaEmbarqueId: 'v5',
    tipo: 'LOCAL',
    localidades: ['Guanajuato', 'Silao'],
    frecuencia: ['LUNES', 'MARTES', 'VIERNES'],
  },
  {
    viaEmbarqueId: 'v6',
    tipo: 'LOCAL',
    localidades: ['Puerto Interior'],
    frecuencia: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'],
  },
];
