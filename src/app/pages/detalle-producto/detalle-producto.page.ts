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
  usuarios: any[] = [];  

  producto: any;
  usuarioActual: any = null;


  constructor(private router: Router,
     private alertctrl: AlertController,
      private location: Location,
      private carritoService: CarritoService) { }

  IrACarritoCompras() {
    this.router.navigate(['/carrito-compras'])
  } 

  Volver() {
    this.router.navigate(['/productos'])
  }

  

irAInicio() {
  const usuarioActual = localStorage.getItem('usuarioActual');
  
  if (usuarioActual) {
    const usuario = JSON.parse(usuarioActual).tipo_usuario;
    
    if (usuario === 'vendedor') {
      this.router.navigate(['/inicio-vendedor']);
    } else if (usuario === 'bodega') {
      this.router.navigate(['/inicio-bodeguero']);
    } else if (usuario === 'contador') {
      this.router.navigate(['/inicio-contadorro']);
    } else if (usuario === 'admin') {
      this.router.navigate(['/inicio-admin']);
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
    return user.tipo_usuario === 'invitado';
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
    this.usuarioActual = localStorage.getItem('usuarioActual')
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.producto = navigation.extras.state['producto'];
    } else {
      // Si no hay producto, volver atrás
      this.location.back();
    }
    
    
  }
}
