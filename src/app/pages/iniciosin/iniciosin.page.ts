import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiproductoService} from 'src/app/services/apiproducto.service';
import { ApiCarrito } from 'src/app/services/apicarrito.service';

@Component({
  selector: 'app-iniciosin',
  templateUrl: './iniciosin.page.html',
  styleUrls: ['./iniciosin.page.scss'],  
  standalone: false
})
export class IniciosinPage implements OnInit {

  productos: any[] = [];

  respuesta: any;

  constructor(private router: Router, private productoService: ApiproductoService, private carritoService: ApiCarrito) { }

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

    localStorage.removeItem('usuarioActual');

    this.carritoService.getDatos().subscribe(
      data => {
        this.respuesta = data;
        console.log(data);
      },
      error => {
        console.error('Error al llamar a la API:', error);
      }
    );
  }

}
