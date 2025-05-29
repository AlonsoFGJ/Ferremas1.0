import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioBodegueroPageRoutingModule } from './inicio-bodeguero-routing.module';

import { InicioBodegueroPage } from './inicio-bodeguero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioBodegueroPageRoutingModule
  ],
  declarations: [InicioBodegueroPage]
})
export class InicioBodegueroPageModule {}
