import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioContadorroPageRoutingModule } from './inicio-contadorro-routing.module';

import { InicioContadorroPage } from './inicio-contadorro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioContadorroPageRoutingModule
  ],
  declarations: [InicioContadorroPage]
})
export class InicioContadorroPageModule {}
