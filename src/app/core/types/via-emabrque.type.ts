export interface ViaEmbarqueType {
  viaEmbarqueId: string;
  tipo: 'LOCAL' | 'FORANEA';
  localidades: string[];
  frecuencia: string[];
}
