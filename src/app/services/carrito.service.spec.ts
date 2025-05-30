import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<any[]>([]);
  carrito$ = this.carritoSubject.asObservable();
  private MAX_CANTIDAD = 5; // Límite máximo por producto

  constructor(private alertCtrl: AlertController) {}

  private get carrito(): any[] {
    return this.carritoSubject.getValue();
  }

  private set carrito(carrito: any[]) {
    this.carritoSubject.next(carrito);
  }

  agregarProducto(producto: any) {
    const carritoActual = [...this.carrito];
    const productoExistente = carritoActual.find(p => p.id === producto.id);
    
    if (productoExistente) {
      if (productoExistente.cantidad >= this.MAX_CANTIDAD) {
        this.mostrarAlerta(`No puedes agregar más de ${this.MAX_CANTIDAD} unidades del mismo producto`);
        return;
      }
      productoExistente.cantidad += 1;
    } else {
      carritoActual.push({...producto, cantidad: 1});
    }
    
    this.carrito = carritoActual;
  }

  eliminarProducto(index: number) {
    const carritoActual = [...this.carrito];
    carritoActual.splice(index, 1);
    this.carrito = carritoActual;
  }

  actualizarCantidad(index: number, cantidad: number) {
    if (cantidad < 1) {
      return;
    }

    if (cantidad > this.MAX_CANTIDAD) {
      this.mostrarAlerta(`No puedes comprar más de ${this.MAX_CANTIDAD} unidades del mismo producto`);
      cantidad = this.MAX_CANTIDAD;
    }

    const carritoActual = [...this.carrito];
    carritoActual[index].cantidad = cantidad;
    this.carrito = carritoActual;
  }

  private async mostrarAlerta(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Límite de compra',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  limpiarCarrito() {
    this.carrito = [];
  }
}