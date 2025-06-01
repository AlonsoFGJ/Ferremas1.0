import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiproductoService} from 'src/app/services/apiproducto.service';

@Component({
  selector: 'app-iniciosin',
  templateUrl: './iniciosin.page.html',
  styleUrls: ['./iniciosin.page.scss'],  
  standalone: false
})
export class IniciosinPage implements OnInit {

  productos: any[] = [];

  constructor(private router: Router, private productoService: ApiproductoService) { }

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

  /*productos = [
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
];*/


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
  }

}
