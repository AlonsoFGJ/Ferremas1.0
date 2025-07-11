import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApipedidoService {

  private apiUrl = 'http://127.0.0.1:8002/pedido';

  constructor(private http: HttpClient) {}

  // GET todos los pedidos
  obtenerPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  // GET pedido por ID
  obtenerPedido(id_pedido: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id_pedido}`);
  }

  // GET pedido por RUT
  obtenerPedidoRut(rut: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/por-rut/${rut}`);
  }

  // Búsqueda genérica (por rut_usuario o descripcion_carrito)
  buscarPedidos(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar/${termino}`);
  }

  // POST agregar pedido (usando query params)
  agregarPedido(pedido: any): Observable<any> {
    return this.http.post(this.apiUrl, pedido);
  }

  // PUT actualizar pedido completo
  actualizarPedido(id_pedido: number, pedido: any): Observable<any> {
    let params = new HttpParams()
      .set('id_pedido', id_pedido)
      .set('rut_usuario', pedido.rut_usuario)
      .set('descripcion_carrito', pedido.descripcion_carrito)
      .set('precio_total', pedido.precio_total)
      .set('pago_comprobado', pedido.pago_comprobado);

    return this.http.put(`${this.apiUrl}/${id_pedido}`, null, { params });
  }

  // PATCH actualizar parcialmente un pedido
  actualizarParcialPedido(id_pedido: number, datos: any): Observable<any> {
    let params = new HttpParams();

    for (const key of Object.keys(datos)) {
      if (datos[key] !== undefined && datos[key] !== null) {
        params = params.set(key, datos[key]);
      }
    }

    return this.http.patch(`${this.apiUrl}/${id_pedido}`, null, { params });
  }

  // DELETE eliminar pedido
  eliminarPedido(id_pedido: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_pedido}`);
  }
}