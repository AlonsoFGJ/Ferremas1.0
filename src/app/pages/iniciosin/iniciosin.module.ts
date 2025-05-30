import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IniciosinPageRoutingModule } from './iniciosin-routing.module';
import { IniciosinPage } from './iniciosin.page';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IniciosinPageRoutingModule,
    MatGridListModule
  ],
  declarations: [IniciosinPage]
})
export class IniciosinPageModule {}