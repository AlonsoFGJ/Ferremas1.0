import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { ApiproductoService } from 'src/app/services/apiproducto.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {
  productos: any[] = [];

  nombreUsuario: string = '';
  terminoBusqueda: string = ''; // Nuevo: término de búsqueda
  productosFiltrados: any[] = []; // Nuevo: productos filtrados

  constructor(private router: Router, private alertctrl: AlertController, private productoService: ApiproductoService) {
    this.productosFiltrados = [...this.productos];
  }

  cerrarSesion() {
  localStorage.removeItem('usuarioActual');
  this.router.navigate(['/iniciosin']);
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

    this.productosFiltrados = this.productos.filter(producto =>
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

  }
    
}
