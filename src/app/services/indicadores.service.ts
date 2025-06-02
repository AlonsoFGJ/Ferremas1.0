import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  private apiUrl = 'https://mindicador.cl/api';

  constructor(private http: HttpClient) {}

  getDolar() {
    return this.http.get<any>(`${this.apiUrl}/dolar`);
  }
}
