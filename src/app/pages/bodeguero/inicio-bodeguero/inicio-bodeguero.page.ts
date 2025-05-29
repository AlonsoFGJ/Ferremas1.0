import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-bodeguero',
  templateUrl: './inicio-bodeguero.page.html',
  styleUrls: ['./inicio-bodeguero.page.scss'],
  standalone: false
})
export class InicioBodegueroPage implements OnInit {
  nombreUsuario: string = '';

  constructor(private router: Router, private alertctrl: AlertController) { }

  ionViewWillEnter() {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);
    this.nombreUsuario = user.usuario;
  }
}
  productos = [
  {
    imagen: 'assets/icon/destornillador-electrico.png',
    titulo: 'Destornillador Electrico',
    subtitulo: '$80.990'
  },
  {
    imagen: 'assets/icon/escalera.png',
    titulo: 'Escalera multipropósito',
    subtitulo: '$74.990'
  },
  {
    imagen: 'assets/icon/pintura.png',
    titulo: 'Pintura Multi-superficies',
    subtitulo: '$124.990'
  },
  {
    imagen: 'assets/icon/yeso25.png',
    titulo: 'Yeso 25kg',
    subtitulo: '$8.990'
  }
];

  ngOnInit() {
    const usuarioActual = localStorage.getItem('usuarioActual');
  if (!usuarioActual) {
    // Redirigir a /iniciosin si no hay sesión activa
    this.router.navigate(['/iniciosin']);
    return;
  }
  }

}
