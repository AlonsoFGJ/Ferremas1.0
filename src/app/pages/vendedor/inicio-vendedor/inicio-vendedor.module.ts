import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioVendedorPageRoutingModule } from './inicio-vendedor-routing.module';

import { InicioVendedorPage } from './inicio-vendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioVendedorPageRoutingModule
  ],
  declarations: [InicioVendedorPage]
})
export class InicioVendedorPageModule {}
