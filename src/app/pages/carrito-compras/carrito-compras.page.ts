import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { ApipedidoService } from 'src/app/services/apipedido.service';

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
  nuevoPedido: any[] = []

  constructor(
    private router: Router, 
    private alertCtrl: AlertController, 
    private carritoService: CarritoService,
    private pedidoService: ApipedidoService
  ) { }

  async pagarCarrito() {
  const usuarioActual = localStorage.getItem('usuarioActual');
  if (!usuarioActual) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'No se encontró información del usuario.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  const user = JSON.parse(usuarioActual);
  const rut_usuario = user.rut;

  if (this.carrito.length === 0) {
    const alert = await this.alertCtrl.create({
      header: 'Carrito vacío',
      message: 'No hay productos en el carrito para realizar el pedido.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Validación de títulos y generación de descripción
  const descripcion_carrito = this.carrito.map(p => {
    if (!p.titulo || p.titulo.trim() === '') {
      return `Producto sin nombre x${p.cantidad}`;
    }
    return `${p.titulo} x${p.cantidad}`;
  }).join(', ');

  const precio_total = this.calcularTotal();

  const payload = {
    rut_usuario,
    descripcion_carrito,
    precio_total,
    pago_comprobado: 'Pendiente'
  };

  console.log('Datos enviados:', payload); // Útil para debugging

  this.pedidoService.agregarPedido(payload).subscribe({
    next: async (response) => {
      console.log('Pedido creado:', response);

      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'Tu pedido ha sido enviado correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      const id_pedido = response.id_pedido;

      this.carritoService.vaciarCarrito();
      this.router.navigate(['/pago'], { queryParams: { id_pedido } });
    },
    error: async (err) => {
      console.error('Error al crear pedido:', err);

      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Ocurrió un problema al procesar tu pedido.',
        buttons: ['OK']
      });
      await alert.present();
    }
  });
}

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