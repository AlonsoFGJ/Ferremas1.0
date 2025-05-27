import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioVendedorPage } from './inicio-vendedor.page';

const routes: Routes = [
  {
    path: '',
    component: InicioVendedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioVendedorPageRoutingModule {}
