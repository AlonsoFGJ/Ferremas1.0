import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCarrito {
  private apiUrl = 'http://localhost:8003/info_carritos'; // URL de tu API
  private apiKey = 'apikeysecreta123';

  constructor(private http: HttpClient) {}

  getDatos(): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });

    return this.http.get(this.apiUrl, { headers });
  }
}