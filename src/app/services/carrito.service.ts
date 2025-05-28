import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CarritoService {
  private carrito: any[] = [];
  private carritoSubject = new BehaviorSubject<any[]>(this.carrito);

  carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  agregarAlCarrito(producto: any) {
    const itemExistente = this.carrito.find(p => p.titulo === producto.titulo);
    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    this.carritoSubject.next(this.carrito);
  }

  obtenerCarrito() {
    return this.carrito;
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    this.carritoSubject.next(this.carrito);
  }

  actualizarCantidad(index: number, nuevaCantidad: number) {
    if (nuevaCantidad < 1) return;
    this.carrito[index].cantidad = nuevaCantidad;
    this.carritoSubject.next(this.carrito);
  }

  vaciarCarrito() {
    this.carrito = [];
    this.carritoSubject.next(this.carrito);
  }
}
