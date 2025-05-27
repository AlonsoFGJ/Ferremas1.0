import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarCuentaPageRoutingModule } from './modificar-cuenta-routing.module';

import { ModificarCuentaPage } from './modificar-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarCuentaPageRoutingModule
  ],
  declarations: [ModificarCuentaPage]
})
export class ModificarCuentaPageModule {}
