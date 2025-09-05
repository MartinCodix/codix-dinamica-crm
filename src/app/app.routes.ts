import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthLayout } from './core/layouts/auth.layout';
import { LoginPage } from './pages/login/login.page';
import { RecuperarPage } from './pages/recuperar/recuperar.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { ClientesPage } from './pages/clientes/clientes.page';
import { ClientePage } from './pages/cliente/cliente.page';
import { PedidosPage } from './pages/pedidos/pedidos.page';
import { PedidoPage } from './pages/pedido/pedido.page';
import { PerfilPage } from './pages/perfil/perfil.page';
import { UsuariosPage } from './pages/usuarios/usuarios.page';
import { CotizacionesPage } from './pages/cotizaciones/cotizaciones.page';
import { UsuarioPage } from './pages/usuario/usuario.page';
import { CotizacionPage } from './pages/cotizacion/cotizacion.page';
import { MainLayout } from './core/layouts/main.layout';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: LoginPage,
      },
    ],
  },
  {
    path: 'ayuda',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: RecuperarPage,
      },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainLayout,
    children: [
      { path: 'inicio', component: InicioPage },
      { path: 'clientes', component: ClientesPage },
      { path: 'clientes/nuevo', component: ClientePage },
      { path: 'clientes/:id', component: ClientePage },
      { path: 'usuarios', data: { roles: ['admin'] }, component: UsuariosPage },
      { path: 'usuarios/nuevo', component: UsuarioPage },
      { path: 'usuarios/:id', component: UsuarioPage },
      { path: 'cotizaciones/nuevo', component: CotizacionPage },
      { path: 'cotizaciones/:id', component: CotizacionPage },
      { path: 'cotizaciones', component: CotizacionesPage },
      { path: 'pedidos/nuevo', component: PedidoPage },
      { path: 'pedidos/:id', component: PedidoPage },
      { path: 'pedidos', component: PedidosPage },
      { path: 'perfil', component: PerfilPage },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
