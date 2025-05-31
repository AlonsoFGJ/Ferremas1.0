import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {
  nombreUsuario: string = '';
  terminoBusqueda: string = ''; // Nuevo: término de búsqueda
  productosFiltrados: any[] = []; // Nuevo: productos filtrados

  constructor(private router: Router, private alertctrl: AlertController) {
    this.productosFiltrados = [...this.productos];
  }

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

  buscar(event: any) {
    const texto = event.target.value.toLowerCase();

    if (!texto) {
      this.productosFiltrados = [...this.productos]; // Mostrar todos si no hay texto
      return;
    }

    this.productosFiltrados = this.productosTodos.filter(producto =>
      producto.titulo.toLowerCase().includes(texto) ||
      producto.subtitulo.toLowerCase().includes(texto)
    );
  }

  irAProductos() {
    this.router.navigate(['/productos'])
  }

  verDetalle(producto: any) {
    this.router.navigate(['/detalle-producto'], {
      state: { producto }
    });
  }

  irAInicioSesion() {
    this.router.navigate(['/inicio-sesion']);
  }

  IrACarritoCompras() {
    this.router.navigate(['/carrito-compras'])
  }

  

  productos = [
  {
    imagen: 'assets/icon/destornillador-electrico.png',
    titulo: 'Destornillador Electrico',
    subtitulo: '$80.990',
    precio: 80990
  },
  {
    imagen: 'assets/icon/escalera.png',
    titulo: 'Escalera multipropósito',
    subtitulo: '$74.990',
    precio: 74990
  },
  {
    imagen: 'assets/icon/pintura.png',
    titulo: 'Pintura Multi-superficies',
    subtitulo: '$124.990',
    precio: 124990,
    tipo: 'pintura'
  },
  {
    imagen: 'assets/icon/yeso25.png',
    titulo: 'Yeso 25kg',
    subtitulo: '$8.990',
    precio: 2590
  }
];

productosTodos = [
  {
    imagen: 'assets/icon/cemento.png',
    titulo: 'Cemento Polpaico',
    subtitulo: '$4.350 / saco',
    precio: 4350
  },
  {
    imagen: 'assets/icon/destornillador-paleta.png',
    titulo: 'Destornillador punta paleta',
    subtitulo: '$4.990 c/u',
    precio: 4990
  },
  {
    imagen: 'assets/icon/plancha.png',
    titulo: 'Plancha OSB 11mm',
    subtitulo: '$19.670 c/u',
    precio: 19670
  },
  {
    imagen: 'assets/icon/yeso25.png',
    titulo: 'Yeso 25kg',
    subtitulo: '$8.990',
    precio: 8990
  },
  {
    imagen: 'assets/icon/destornillador-electrico.png',
    titulo: 'Destornillador Electrico',
    subtitulo: '$80.990',
    precio: 80990
  },
  {
    imagen: 'assets/icon/pintura.png',
    titulo: 'Pintura Multi-superficies',
    subtitulo: '$124.990',
    precio: 124990,
    tipo: 'pintura'
  },
  {
    imagen: 'assets/icon/plancha-volca.png',
    titulo: 'Plancha Volcanita 10 mm',
    subtitulo: '$6.590',
    precio: 6590
  },
  {
    imagen: 'assets/icon/escalera.png',
    titulo: 'Escalera multipropósito',
    subtitulo: '$74.990',
    precio: 74990
  },
  {
    imagen: 'assets/icon/yeso5.png',
    titulo: 'Yeso 5kg',
    subtitulo: '$2.590 c/u',
    precio: 2590
  },
  {
    imagen: 'assets/icon/yeso1.png',
    titulo: 'Yeso 1kg',
    subtitulo: '$690 c/u',
    precio: 690
  },
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
