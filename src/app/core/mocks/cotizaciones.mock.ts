import { CotizacionType } from '../types/cotizacion.type';
import { PaginationType } from '../types/pagination.type';

const base: CotizacionType[] = [
  {
    cotizacionId: 'c1',
    numero: 448829,
    cliente: {
      clienteId: 'c1',
      clave: 'CLI-001',
      nombre: 'HAL MÈXICO',
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
      nombre: 'cdiaz@dinamica.com',
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
    tipoCambioDls: 0,
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
  },
];
