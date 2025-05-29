import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioBodegueroPage } from './inicio-bodeguero.page';

const routes: Routes = [
  {
    path: '',
    component: InicioBodegueroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioBodegueroPageRoutingModule {}
