import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.page.html',
  styleUrls: ['./carrito-compras.page.scss'],
  standalone: false
})
export class CarritoComprasPage implements OnInit {
  nombreUsuario: string = '';
  carrito: any[] = [];
  maxCantidad: number = 5; // Límite máximo

  constructor(
    private router: Router, 
    private alertCtrl: AlertController, 
    private carritoService: CarritoService
  ) { }

  ionViewWillEnter() {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);

    if (user.nombre) {
      this.nombreUsuario = user.nombre;
    } else if (user.usuario) {
      this.nombreUsuario = user.usuario;
    }
  }
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

  ngOnInit() {
    this.carritoService.carrito$.subscribe(data => {
      this.carrito = data;
    });
  }

  eliminarDelCarrito(index: number) {
    this.carritoService.eliminarProducto(index);
  }

  async actualizarCantidad(index: number, event: any) {
    const nuevaCantidad = parseInt(event.detail.value, 10);
    
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      // Restaurar valor anterior si no es válido
      event.target.value = this.carrito[index].cantidad;
      return;
    }

    if (nuevaCantidad > this.maxCantidad) {
      const alert = await this.alertCtrl.create({
        header: 'Límite excedido',
        message: `No puedes comprar más de ${this.maxCantidad} unidades del mismo producto.`,
        buttons: ['OK']
      });
      await alert.present();
      event.target.value = this.maxCantidad;
      this.carritoService.actualizarCantidad(index, this.maxCantidad);
      return;
    }

    this.carritoService.actualizarCantidad(index, nuevaCantidad);
  }

  calcularTotal() {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }
}