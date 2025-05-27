import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudPedidoPage } from './crud-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: CrudPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudPedidoPageRoutingModule {}
