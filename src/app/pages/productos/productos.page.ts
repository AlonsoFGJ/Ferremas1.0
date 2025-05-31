import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {
  nombreUsuario: string = '';
  usuarioActual: any = null;
  terminoBusqueda: string = ''; // Nuevo: término de búsqueda
  productosFiltrados: any[] = []; // Nuevo: productos filtrados


  private usuariosPredefinidos = [
    { usuario: 'admin', contrasenia: 'admin123' },
    { usuario: 'vendedor', contrasenia: 'vendedor123' },
    { usuario: 'contador', contrasenia: 'contador123' },
    { usuario: 'bodega', contrasenia: 'bodega1234' },
    { usuario: 'invitado', contrasenia: 'invitado123' }
  ];

constructor(private router: Router,) {
  const userData = localStorage.getItem('usuarioActual');
  this.usuarioActual = userData ? JSON.parse(userData) : null;
  this.productosFiltrados = [...this.productos];
}

irAInicio() {
  const usuarioActual = localStorage.getItem('usuarioActual');
  
  if (usuarioActual) {
    const usuario = JSON.parse(usuarioActual).usuario;
    
    if (usuario === 'vendedor') {
      this.router.navigate(['/inicio-vendedor']);
    } else if (usuario === 'bodega') {
      this.router.navigate(['/inicio-bodeguero']);
    } else if (usuario === 'contador') {
      this.router.navigate(['/inicio-contadorro']);
    } else {
      this.router.navigate(['/inicio']);
    }
  } else {
    this.router.navigate(['/iniciosin']);
  }
}

buscar(event: any) {
    const texto = event.target.value.toLowerCase();

    if (!texto) {
      this.productosFiltrados = [...this.productos]; // Mostrar todos si no hay texto
      return;
    }

    this.productosFiltrados = this.productos.filter(producto =>
      producto.titulo.toLowerCase().includes(texto) ||
      producto.subtitulo.toLowerCase().includes(texto)
    );
  }

esInvitado(): boolean {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);
    return user.usuario === 'invitado';
  }
  return false;
}

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.usuarioActual = null;
    // redirigir si quieres
  }

  verDetalle(producto: any) {
    this.router.navigate(['/detalle-producto'], {
      state: { producto }
    });
  }

  ionViewWillEnter() {
    const userData = localStorage.getItem('usuarioActual');
    if (userData) {
      const user = JSON.parse(userData);
      this.nombreUsuario = user.usuario;
    }
  }

  irAInicioSesion() {
    this.router.navigate(['/inicio-sesion']);
  }

  IrACarritoCompras() {
    this.router.navigate(['/carrito-compras'])
  }

  


  productos = [
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
  }

}
