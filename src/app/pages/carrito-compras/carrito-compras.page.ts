import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { ApipedidoService } from 'src/app/services/apipedido.service';
import { ApiCarrito } from 'src/app/services/apicarrito.service';
import { ApiproductoService } from 'src/app/services/apiproducto.service';

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
  precioTotal: number = 0;
  carritoId: number = 0;

  constructor(
    private router: Router, 
    private alertCtrl: AlertController, 
    private carritoService: CarritoService,
    private pedidoService: ApipedidoService,
    private apiCarrito: ApiCarrito,
    private productoService: ApiproductoService
  ) { }

  private parseDescripcionCarrito(descripcion: string, productosApi: any[]): any[] {
  const items = descripcion.split(', ');
  return items.map(item => {
    const [titulo, cantidad] = item.split(' x');
    const producto = productosApi.find(p => p.titulo.trim() === titulo.trim());

    if (producto) {
      return {
        ...producto,
        cantidad: parseInt(cantidad, 10)
      };
    } else {
      console.warn('Producto no encontrado en API:', titulo);
      return null;
    }
  }).filter(p => p !== null);
}

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

  /*this.pedidoService.agregarPedido(payload).subscribe({
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
  });*/
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

parsearDescripcionADetalle(descripcion: string): { titulo: string, cantidad: number }[] {
  return descripcion.split(',').map(item => {
    const partes = item.trim().split(' x');
    return {
      titulo: partes[0].trim(),
      cantidad: parseInt(partes[1], 10)
    };
  });
}

  ngOnInit() {
  this.apiCarrito.getDatos().subscribe(carritos => {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  const rut_usuario = usuarioActual.rut || 'SIN_RUT';

  const carritoUsuario = carritos.find((c: any) => c.rut_usuario === rut_usuario);

  if (carritoUsuario) {
    const descripcion = carritoUsuario.descripcion_carrito;
    const productosParseados = this.parsearDescripcionADetalle(descripcion);

    // Cargar detalles de productos
    this.productoService.obtenerProductos().subscribe(productos => {
      const carritoCompleto = productosParseados.map(p => {
        const productoCompleto = productos.find((prod: any) => prod.titulo === p.titulo);
        return {
          ...productoCompleto,
          cantidad: p.cantidad
        };
      });

      // Aquí actualizas el carrito en el servicio, no solo localmente
      this.carritoService.setCarritoDesdeApi(carritoCompleto);

      // Además actualiza la variable local para mostrar en la página
      this.carrito = carritoCompleto;
    });
  }
});


  // Suscribirse al carrito local (desde el servicio)
  this.carritoService.carrito$.subscribe(data => {
    this.carrito = data;
    console.log('🧾 Carrito local cargado:', this.carrito);
  });
}
  
  guardarCarrito() {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  const rut_usuario = usuarioActual.rut || 'SIN_RUT';

  const descripcion_carrito = this.carrito
    .map(p => `${p.titulo} x${p.cantidad}`)
    .join(', ');

  const precio_total = this.calcularTotal();

  this.apiCarrito.getCarritoPorRut(rut_usuario).subscribe({
    next: carritoExistente => {
      // 🛠 Si ya existe, actualizamos
      const id_carrito = carritoExistente.id_carrito;

      const carritoActualizado = {
        id_carrito,
        rut_usuario,
        descripcion_carrito,
        precio_total
      };

      this.apiCarrito.actualizarParcialCarrito(id_carrito, carritoActualizado).subscribe({
        next: res => console.log('✅ Carrito actualizado:', res),
        error: err => console.error('❌ Error al actualizar carrito:', err)
      });
    },
    error: err => {
      if (err.status === 404) {
        // 🆕 Si no existe, crear nuevo
        this.apiCarrito.getDatos().subscribe(carritos => {
          const ids = carritos.map((c: any) => c.id_carrito);
          const nuevoId = ids.length ? Math.max(...ids) + 1 : 2;

          const nuevoCarrito = {
            id_carrito: nuevoId,
            rut_usuario,
            descripcion_carrito,
            precio_total
          };

          this.apiCarrito.crearCarrito(nuevoCarrito).subscribe({
            next: res => console.log('✅ Carrito creado:', res),
            error: err => console.error('❌ Error al crear carrito:', err)
          });
        });
      } else {
        console.error('❌ Error al buscar carrito existente:', err);
      }
    }
  });
}

  eliminarDelCarrito(index: number) {
  // Eliminar producto del carrito local
  this.carrito.splice(index, 1);

  // Reconstruir descripción y total
  const descripcion_carrito = this.carrito
    .map(p => `${p.titulo} x${p.cantidad}`)
    .join(', ');

  const precio_total = this.calcularTotal();

  // Obtener rut usuario actual
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  const rut_usuario = usuarioActual.rut || 'SIN_RUT';

  // Preparar objeto actualizado para la API
  const carritoActualizado = {
    rut_usuario,
    descripcion_carrito,
    precio_total
  };

  // Llamar a la API para actualizar el carrito (PATCH)
  this.apiCarrito.actualizarParcialCarrito(this.carritoId, carritoActualizado).subscribe({
    next: res => {
      console.log('✅ Producto eliminado y carrito actualizado:', res);
    },
    error: err => {
      console.error('❌ Error al actualizar carrito:', err);
    }
  });
}

  async actualizarCantidad(index: number, event: any) {
  const nuevaCantidad = parseInt(event.detail.value, 10);
  
  if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
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
    this.carrito[index].cantidad = this.maxCantidad;
  } else {
    this.carrito[index].cantidad = nuevaCantidad;
  }

  // 🔁 Actualizar descripción y total en base al nuevo carrito
  const descripcion_carrito = this.carrito
    .map(p => `${p.titulo} x${p.cantidad}`)
    .join(', ');

  const precio_total = this.calcularTotal();

  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  const rut_usuario = usuarioActual.rut || 'SIN_RUT';

  const carritoActualizado = {
    rut_usuario,
    descripcion_carrito,
    precio_total
  };

  // 🔁 Llamar a la API para actualizar
  this.apiCarrito.actualizarParcialCarrito(this.carritoId, carritoActualizado).subscribe({
    next: res => console.log('✅ Carrito actualizado:', res),
    error: err => console.error('❌ Error al actualizar carrito:', err)
  });
}

  calcularTotal() {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }

  cerrarSesion() {
    this.router.navigate(['/iniciosin'])
  }
}