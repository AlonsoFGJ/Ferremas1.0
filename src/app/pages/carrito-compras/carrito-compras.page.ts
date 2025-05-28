import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
//import { FormsModule } from '@angular/forms'; (PARA USAR LUEGO EN API?)

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.page.html',
  styleUrls: ['./carrito-compras.page.scss'],
  standalone: false
})
export class CarritoComprasPage implements OnInit {
  nombreUsuario: string = '';
  carrito: any[] = [];

  constructor(private router: Router, private alertctrl: AlertController, private carritoService: CarritoService) { }

  ionViewWillEnter() {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);
    this.nombreUsuario = user.usuario;
  }
}




  ngOnInit() {
    this.carritoService.carrito$.subscribe(carrito => {
      this.carrito = [...carrito];
    });
  }

  eliminarDelCarrito(index: number) {
    this.carritoService.eliminarProducto(index);
  }


  actualizarCantidad(index: number, event: any) {
    const nuevaCantidad = parseInt(event.detail.value, 10);
    this.carritoService.actualizarCantidad(index, nuevaCantidad);
  }

  calcularTotal() {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }
}
