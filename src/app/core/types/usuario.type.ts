export interface UsuarioType {
  usuarioId: string;
  nombre: string;
  correo: string;
  password: string;
  token?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  ultimaConexion: Date;
  enLinea: boolean;
}
