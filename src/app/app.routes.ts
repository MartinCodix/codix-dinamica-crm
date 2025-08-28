import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthLayout } from './core/layouts/auth.layout';
import { LoginPage } from './pages/login/login.page';
import { RecuperarPage } from './pages/recuperar/recuperar.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { ClientesPage } from './pages/clientes/clientes.page';
import { ClientePage } from './pages/cliente/cliente.page';
import { PedidosPage } from './pages/pedidos/pedidos.page';
import { PerfilPage } from './pages/perfil/perfil.page';
import { UsuariosPage } from './pages/usuarios/usuarios.page';
import { CotizacionesPage } from './pages/cotizaciones/cotizaciones.page';
import { UsuarioPage } from './pages/usuario/usuario.page';

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
    children: [
      {
        path: 'inicio',
        component: InicioPage,
      },
      {
        path: 'clientes',
        component: ClientesPage,
      },
      {
        path: 'clientes/nuevo',
        component: ClientePage,
      },
      {
        path: 'clientes/:id',
        component: ClientePage,
      },
      {
        path: 'usuarios',
        data: { roles: ['admin'] },
        component: UsuariosPage,
      },
      {
        path: 'usuarios/nuevo',
        component: UsuarioPage,
      },
      {
        path: 'usuarios/:id',
        component: UsuarioPage,
      },
      {
        path: 'cotizaciones',
        component: CotizacionesPage,
      },
      {
        path: 'pedidos',
        component: PedidosPage,
      },
      {
        path: 'perfil',
        component: PerfilPage,
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
