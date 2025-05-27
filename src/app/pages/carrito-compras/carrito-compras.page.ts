import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.page.html',
  styleUrls: ['./carrito-compras.page.scss'],
  standalone: false
})
export class CarritoComprasPage implements OnInit {
  nombreUsuario: string = '';

  constructor(private router: Router, private alertctrl: AlertController) { }

  ionViewWillEnter() {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);
    this.nombreUsuario = user.usuario;
  }
}

  carrito = [
  {
    titulo: 'Cemento Portland',
    imagen: 'assets/icon/logosinfondo.png',
    cantidad: 3,
    precio: 12990
  },
  {
    titulo: 'Ladrillo Hueco',
    imagen: 'assets/icon/logosinfondo.png',
    cantidad: 5,
    precio: 350
  },
  {
    titulo: 'Plancha OSB 11mm',
    imagen: 'assets/icon/logosinfondo.png',
    cantidad: 1,
    precio: 15490
  }
];

  ngOnInit() {
  }

}
