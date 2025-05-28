import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: false
})
export class DetalleProductoPage implements OnInit {
  producto: any;

  constructor(private router: Router,
     private alertctrl: AlertController,
      private location: Location,
      private carritoService: CarritoService) { }

  IrACarritoCompras() {
    this.router.navigate(['/carrito-compras'])
  } 

  agregarAlCarrito() {
    this.carritoService.agregarAlCarrito(this.producto);
    this.mostrarAlerta('Producto añadido', `${this.producto.titulo} ha sido agregado al carrito.`);
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertctrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.producto = navigation.extras.state['producto'];
    } else {
      // Si no hay producto, volver atrás
      this.location.back();
    }
    
  }
}
