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

  private usuariosPredefinidos = [
    { usuario: 'admin', contrasenia: 'admin123' },
    { usuario: 'vendedor', contrasenia: 'vendedor123' },
    { usuario: 'contador', contrasenia: 'contador123' },
    { usuario: 'bodega', contrasenia: 'bodega1234' },
    { usuario: 'invitado', contrasenia: 'invitado123' }
  ];

  constructor(private router: Router,
     private alertctrl: AlertController,
      private location: Location,
      private carritoService: CarritoService) { }

  IrACarritoCompras() {
    this.router.navigate(['/carrito-compras'])
  } 

  irAInicio() {
  const usuarioActual = localStorage.getItem('usuarioActual');
  
  if (usuarioActual) {
    const usuario = JSON.parse(usuarioActual).usuario;
    
    if (usuario === 'vendedor') {
      this.router.navigate(['/inicio-vendedor']);
    } else if (usuario === 'bodega') {
      this.router.navigate(['/inicio-bodeguero']);
    } else if (usuario === 'contador') {
      this.router.navigate(['/inicio-contadorro']);
    } else {
      this.router.navigate(['/inicio']);
    }
  } else {
    this.router.navigate(['/iniciosin']);
  }
}

  agregarAlCarrito() {
  if (this.esInvitado()) {
    this.carritoService.agregarAlCarrito(this.producto);
    this.mostrarAlerta('Producto añadido', `${this.producto.titulo} ha sido agregado al carrito.`);
  } else {
    this.mostrarAlerta('Acción no permitida', 'Solo los usuarios registrados pueden agregar productos al carrito.');
  }
}
  esInvitado(): boolean {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);
    return user.usuario === 'invitado';
  }
  return false;
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
