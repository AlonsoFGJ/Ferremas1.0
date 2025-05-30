import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-iniciosin',
  templateUrl: './iniciosin.page.html',
  styleUrls: ['./iniciosin.page.scss'],  
  standalone: false,
    template: `
    <div *ngIf="producto$ | async as producto">
      <h2>{{ producto.nombre }}</h2>
      <p>{{ producto.description }}</p>
      <p>Precio: {{ producto.precis }}</p>
    </div>
  `
})
export class IniciosinPage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  irAInicioSesion() {
    this.router.navigate(['/inicio-sesion']);
  }

  irAInicio() {
    this.router.navigate(['/iniciosin']);
  }

  irAProductos() {
    this.router.navigate(['/productos'])
  }

  verDetalle(producto: any) {
    this.router.navigate(['/detalle-producto'], {
      state: { producto }
    });
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
      this.router.navigate(['/iniciosin']);
      return;
    }
    

  }

}