import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCarrito {
  private apiUrl = 'http://localhost:8003/info_carritos'; // URL de tu API
  private apiUrlAlt = 'http://localhost:8003/info_carrito';
  private apiKey = 'apikeysecreta123';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    });
  }

  // GET: Obtener todos los carritos
  getDatos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // GET: Obtener un carrito por RUT
  getCarritoPorRut(rut: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/${rut}`, { headers: this.getHeaders()});
}

// GET: Obtener un carrito por id
  getCarritoPorId(id: number): Observable<any> {
  return this.http.get(`${this.apiUrlAlt}/${id}`, { headers: this.getHeaders()});
}

  // POST: Crear un nuevo carrito
  crearCarrito(carrito: any): Observable<any> {
    return this.http.post(this.apiUrl, carrito, { headers: this.getHeaders() });
  }

  // PUT: Actualizar un carrito completo
  actualizarCarrito(id: number, carrito: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, carrito, { headers: this.getHeaders() });
  }

  // DELETE: Eliminar un carrito
  eliminarCarrito(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // DELETE: Eliminar un carrito por RUT
  eliminarCarritoRut(rut: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/por-rut/${rut}`, { headers: this.getHeaders() });
  }

  // PATCH: Actualización parcial del carrito
  actualizarParcialCarrito(rut: string, cambios: any): Observable<any> {
  return this.http.patch(`${this.apiUrl}/por-rut/${rut}`, cambios, {headers: this.getHeaders()});
  }

  
}