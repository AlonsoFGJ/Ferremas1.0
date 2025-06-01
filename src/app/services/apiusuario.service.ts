import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiusuarioService {

  private apiUrl = 'http://127.0.0.1:8001/usuarios';

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  // GET: obtener usuario por RUT
  obtenerUsuario(rut: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${rut}`);
  }

  // POST: agregar nuevo usuario
  agregarUsuario(usuario: any): Observable<any> {
    let params = new HttpParams()
      .set('rut', usuario.rut)
      .set('tipo_usuario', usuario.tipo_usuario)
      .set('p_nombre', usuario.p_nombre)
      .set('s_nombre', usuario.s_nombre || '')
      .set('p_apellido', usuario.p_apellido)
      .set('s_apellido', usuario.s_apellido || '')
      .set('direccion', usuario.direccion)
      .set('correo', usuario.correo)
      .set('contra', usuario.contra);

    return this.http.post(`${this.apiUrl}/`, null, { params });
  }

  // PUT: actualizar usuario completo
  actualizarUsuario(rut: string, usuario: any): Observable<any> {
    let params = new HttpParams()
      .set('rut', rut)
      .set('tipo_usuario', usuario.tipo_usuario)
      .set('p_nombre', usuario.p_nombre)
      .set('s_nombre', usuario.s_nombre || '')
      .set('p_apellido', usuario.p_apellido)
      .set('s_apellido', usuario.s_apellido || '')
      .set('direccion', usuario.direccion)
      .set('correo', usuario.correo)
      .set('contra', usuario.contra);

    return this.http.put(`${this.apiUrl}/${rut}`, null, { params });
  }

  // PATCH: actualizar parcialmente al usuario
  actualizarParcial(rut: string, datos: any): Observable<any> {
    let params = new HttpParams();
    for (const key of Object.keys(datos)) {
      if (datos[key] !== undefined && datos[key] !== null) {
        params = params.set(key, datos[key]);
      }
    }
    return this.http.patch(`${this.apiUrl}/${rut}`, null, { params });
  }

  // DELETE: eliminar usuario
  eliminarUsuario(rut: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${rut}`);
  }
}
