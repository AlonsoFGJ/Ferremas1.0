import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarCuentaPage } from './modificar-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarCuentaPageRoutingModule {}
