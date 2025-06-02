import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'iniciosin',
    pathMatch: 'full'
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: 'crear-cuenta',
    loadChildren: () => import('./pages/crear-cuenta/crear-cuenta.module').then( m => m.CrearCuentaPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'carrito-compras',
    loadChildren: () => import('./pages/carrito-compras/carrito-compras.module').then( m => m.CarritoComprasPageModule)
  },
  {
    path: 'modificar-cuenta',
    loadChildren: () => import('./pages/modificar-cuenta/modificar-cuenta.module').then( m => m.ModificarCuentaPageModule)
  },
  {
    path: 'cambiar-contrasenna',
    loadChildren: () => import('./pages/cambiar-contrasenna/cambiar-contrasenna.module').then( m => m.CambiarContrasennaPageModule)
  },
  {
    path: 'pago',
    loadChildren: () => import('./pages/pago/pago.module').then( m => m.PagoPageModule)
  },
  {
    path: 'crud-pedido',
    loadChildren: () => import('./pages/bodeguero/crud-pedido/crud-pedido.module').then( m => m.CrudPedidoPageModule)
  },
  {
    path: 'crud-productos',
    loadChildren: () => import('./pages/vendedor/crud-productos/crud-productos.module').then( m => m.CrudProductosPageModule)
  },
  {
    path: 'despachos',
    loadChildren: () => import('./pages/vendedor/despachos/despachos.module').then( m => m.DespachosPageModule)
  },
  {
    path: 'entregas',
    loadChildren: () => import('./pages/contador/entregas/entregas.module').then( m => m.EntregasPageModule)
  },
  {
    path: 'iniciosin',
    loadChildren: () => import('./pages/iniciosin/iniciosin.module').then( m => m.IniciosinPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'inicio-vendedor',
    loadChildren: () => import('./pages/vendedor/inicio-vendedor/inicio-vendedor.module').then( m => m.InicioVendedorPageModule)
  },
  {
    path: 'detalle-producto',
    loadChildren: () => import('./pages/detalle-producto/detalle-producto.module').then( m => m.DetalleProductoPageModule)
  },
  {
    path: 'inicio-bodeguero',
    loadChildren: () => import('./pages/bodeguero/inicio-bodeguero/inicio-bodeguero.module').then( m => m.InicioBodegueroPageModule)
  },
  {
    path: 'inicio-contadorro',
    loadChildren: () => import('./pages/contador/inicio-contadorro/inicio-contadorro.module').then( m => m.InicioContadorroPageModule)
  },
  {
    path: 'inicio-admin',
    loadChildren: () => import('./pages/admin/inicio-admin/inicio-admin.module').then( m => m.InicioAdminPageModule)
  },
  {
    path: 'administrar',
    loadChildren: () => import('./pages/admin/administrar/administrar.module').then( m => m.AdministrarPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
