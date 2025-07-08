import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { ApiproductoService } from 'src/app/services/apiproducto.service';

@Component({
  selector: 'app-inicio-bodeguero',
  templateUrl: './inicio-bodeguero.page.html',
  styleUrls: ['./inicio-bodeguero.page.scss'],
  standalone: false
})
export class InicioBodegueroPage implements OnInit {
  productos: any[] = [];

  nombreUsuario: string = '';

  constructor(private router: Router, private alertctrl: AlertController, private productoService: ApiproductoService) { }

  ionViewWillEnter() {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);

    if (user.nombre) {
      this.nombreUsuario = user.nombre;
    } else if (user.usuario) {
      this.nombreUsuario = user.p_nombre;
    }
  }
}

  irAProductos() {
    this.router.navigate(['/productos'])
  }

  ngOnInit() {
    this.productoService.obtenerProductos().subscribe(
      (res) => {
        this.productos = res.slice(0, 5);
        console.log('Productos:', res);
      },
      (error) => {
        console.error('Error al obtener productos', error);
      }
    );


    const usuarioActual = localStorage.getItem('usuarioActual');
  if (!usuarioActual) {
    // Redirigir a /iniciosin si no hay sesión activa
    this.router.navigate(['/iniciosin']);
    return;
  }

  const usuarioActualStr = JSON.parse(usuarioActual)
  const usuarioNecesario = 'bodeguero'

  if (usuarioActualStr.tipo_usuario !== usuarioNecesario) {
  // El tipo de usuario no coincide
  this.router.navigate(['/iniciosin']); 
  return;
}
  }

}
