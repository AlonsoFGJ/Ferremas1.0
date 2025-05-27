import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudPedidoPageRoutingModule } from './crud-pedido-routing.module';

import { CrudPedidoPage } from './crud-pedido.page';

@NgModule({
  declarations: [CrudPedidoPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrudPedidoPageRoutingModule
  ]
})
export class CrudPedidoPageModule {}
