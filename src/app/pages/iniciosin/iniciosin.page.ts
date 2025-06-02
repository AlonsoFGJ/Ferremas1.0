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
