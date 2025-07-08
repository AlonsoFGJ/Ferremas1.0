import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-despachos',
  templateUrl: './despachos.page.html',
  styleUrls: ['./despachos.page.scss'],
  standalone: false
})
export class DespachosPage implements OnInit {
  nombreUsuario: string = '';
  usuarioActual: any = null;


  constructor(private router: Router, private alertctrl: AlertController) { 
    this.usuarioActual = localStorage.getItem('usuario');
  }

irAInicio() {
  const usuarioActual = localStorage.getItem('usuarioActual');
  
  if (usuarioActual) {
    const usuario = JSON.parse(usuarioActual).tipo_usuario;
    
    if (usuario === 'vendedor') {
      this.router.navigate(['/inicio-vendedor']);
    } else if (usuario === 'bodega') {
      this.router.navigate(['/inicio-bodeguero']);
    } else if (usuario === 'contador') {
      this.router.navigate(['/inicio-contadorro']);
    } else if (usuario === 'admin') {
      this.router.navigate(['/inicio-admin']);
    } else {
      this.router.navigate(['/inicio']);
    }
  } else {
    this.router.navigate(['/iniciosin']);
  }
}

  ionViewWillEnter() {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);
    this.nombreUsuario = user.usuario;
  }
}

despachos = [
  {
    producto: {
      nombre: 'Yeso 25 kg',
      imagen: '/assets/icon/yeso25.png',
      precio: 15000
    },
    cantidad: 2,
    cliente: {
      nombre: 'Juan Pérez',
      telefono: '+56987654321'
    },
    direccion: 'Av. Principal 123, Santiago',
    entregado: false,
    fecha: '2023-05-15'
  },
  {
    producto: {
      nombre: 'Destornillador Phillips',
      imagen: '/assets/icon/destornillador-paleta.png',
      precio: 5000
    },
    cantidad: 5,
    cliente: {
      nombre: 'María González',
      telefono: '+56912345678'
    },
    direccion: 'Calle Secundaria 456, Valparaíso',
    entregado: true,
    fecha: '2023-05-10'
  }
  // Puedes añadir más despachos aquí
];

cambiarEstado(despacho: any) {
  despacho.entregado = !despacho.entregado;
  // Aquí deberías también actualizar el estado en tu base de datos
}

  ngOnInit() {
    const usuarioActual = localStorage.getItem('usuarioActual');
  if (!usuarioActual) {
    // Redirigir a /iniciosin si no hay sesión activa
    this.router.navigate(['/iniciosin']);
    return;
  }

  const usuarioActualStr = JSON.parse(usuarioActual)
  const usuarioNecesario = 'vendedor'

  if (usuarioActualStr.tipo_usuario !== usuarioNecesario) {
  // El tipo de usuario no coincide
  this.router.navigate(['/iniciosin']); 
  return;
}
  }

}
