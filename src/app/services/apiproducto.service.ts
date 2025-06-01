import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiproductoService {

  private apiUrl = 'http://127.0.0.1:8000/producto';
  

  constructor(private http: HttpClient) { }

  // GET todos los productos
  obtenerProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  // GET producto por ID
  obtenerProducto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getProductosPorTipo(tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  // Búsqueda genérica (por título o descripción)
  buscarProductos(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar/${termino}`);
  }
  

  // POST agregar producto (por query params)
  agregarProducto(producto: any): Observable<any> {
    let params = new HttpParams()
      .set('id_producto', producto.id_producto)
      .set('titulo', producto.titulo)
      .set('descripcion', producto.descripcion)
      .set('stock', producto.stock)
      .set('precio', producto.precio)
      .set('tipo', producto.tipo);

    return this.http.post(`${this.apiUrl}/`, null, { params });
  }

  // PUT actualizar producto completo
  actualizarProducto(id_producto: number, producto: any): Observable<any> {
    let params = new HttpParams()
      .set('id_producto', id_producto)
      .set('titulo', producto.titulo)
      .set('descripcion', producto.descripcion)
      .set('stock', producto.stock)
      .set('precio', producto.precio)
      .set('tipo', producto.tipo);

    return this.http.put(`${this.apiUrl}/${id_producto}`, null, { params });
  }

  // PATCH actualizar parcial
  actualizarParcial(id_producto: number, datos: any): Observable<any> {
    let params = new HttpParams();

    // Solo agregamos los campos que no son null/undefined
    for (const key of Object.keys(datos)) {
      if (datos[key] !== undefined && datos[key] !== null) {
        params = params.set(key, datos[key]);
      }
    }

    return this.http.patch(`${this.apiUrl}/${id_producto}`, null, { params });
  }

  // DELETE eliminar producto
  eliminarProducto(id_producto: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_producto}`);
  }
}
