import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiCarrito } from './apicarrito.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Inicializamos el carrito vacío
  private carrito: any[] = [];
  // Usamos BehaviorSubject para manejar el carrito reactivo
  private carritoSubject = new BehaviorSubject<any[]>(this.carrito);

  // Observable público para que se suscriban los componentes
  carrito$ = this.carritoSubject.asObservable();

  constructor(private apiCarrito: ApiCarrito) {}

  get apiCarritos() {
    return this.apiCarrito;
  }

  // Método para obtener el valor actual del carrito
  private get carritoActual(): any[] {
    return this.carritoSubject.getValue();
  }

  // Método para actualizar el carrito y emitir el nuevo valor
  private set carritoActual(value: any[]) {
    this.carritoSubject.next(value);
  }

  agregarAlCarrito(productoNuevo: any) {
  let carritoActual = this.carritoActual; // Obtenemos la lista actual

  const index = carritoActual.findIndex(p => p.id_producto === productoNuevo.id_producto);

  if (index !== -1) {
    carritoActual[index].cantidad += 1;
  } else {
    carritoActual.push({
      ...productoNuevo,
      cantidad: 1
    });
  }

  this.carritoActual = carritoActual; // Emitimos los cambios

  this.actualizarApiCarrito(carritoActual);
}

  private actualizarApiCarrito(carritoActual: any[]) {
    this.apiCarrito.getDatos().subscribe(carritos => {
      const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
      const rut_usuario = usuarioActual.rut || 'SIN_RUT';

      const carritoUsuario = carritos.find((c: any) => c.rut_usuario === rut_usuario);

      const descripcion_carrito = this.crearDescripcionCarrito(carritoActual);
      const precio_total = this.calcularTotal(carritoActual);

      if (carritoUsuario) {
        const datosActualizar = {
          descripcion_carrito,
          precio_total
        };

        this.apiCarrito.actualizarParcialCarrito(rut_usuario, datosActualizar).subscribe(() => {
          console.log('Carrito actualizado en API');
        });

      } else {
        const nuevoId = carritos.length ? Math.max(...carritos.map((c: any) => c.id_carrito)) + 1 : 2;

        const nuevoCarrito = {
          id_carrito: nuevoId,
          rut_usuario,
          descripcion_carrito,
          precio_total
        };

        this.apiCarrito.crearCarrito(nuevoCarrito).subscribe(() => {
          console.log('Carrito creado en API');
        });
      }
    });
  }

  crearDescripcionCarrito(carrito: any[]) {
    return carrito.map(p => `${p.titulo} x${p.cantidad}`).join(', ');
  }

  calcularTotal(carrito: any[]) {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }

  obtenerCarrito() {
    return this.carritoActual;
  }

  eliminarProducto(index: number) {
    let carritoActual = this.carritoActual;

    if (index < 0 || index >= carritoActual.length) {
      console.warn(`⚠️ Índice fuera de rango: ${index}`);
      return;
    }

    carritoActual.splice(index, 1);
    this.carritoActual = carritoActual;

    this.actualizarApiCarrito(carritoActual);
  }

  actualizarCantidad(index: number, cantidad: number) {
    let carritoActual = this.carritoActual;

    if (!carritoActual[index]) {
      console.warn(`⚠️ Producto en índice ${index} no encontrado`);
      return;
    }

    carritoActual[index].cantidad = cantidad;
    this.carritoActual = carritoActual;

    this.actualizarApiCarrito(carritoActual);
  }

  vaciarCarrito() {
    this.carritoActual = [];
    // También podrías llamar a la API para borrar o actualizar el carrito vaciándolo
  }

  setCarritoDesdeApi(carritoDesdeApi: any[]) {
  this.carritoSubject.next(carritoDesdeApi);
}
}
