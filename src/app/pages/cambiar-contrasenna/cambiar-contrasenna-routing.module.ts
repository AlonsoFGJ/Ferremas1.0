import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarContrasennaPage } from './cambiar-contrasenna.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarContrasennaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarContrasennaPageRoutingModule {}
