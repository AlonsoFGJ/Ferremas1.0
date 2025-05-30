import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosLecturaService {
  constructor(private firestore: AngularFirestore) { }

  getProducto(id: string): Observable<any> {
    // Add error handling
    try {
      return this.firestore.collection('productos').doc(id).valueChanges();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
}