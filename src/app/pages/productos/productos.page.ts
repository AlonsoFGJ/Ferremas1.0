import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiproductoService} from 'src/app/services/apiproducto.service';



@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {

  productos: any[] = [];
  nombreUsuario: string = '';
  usuarioActual: any = null;
  terminoBusqueda: string = ''; 
  productosFiltrados: any[] = []; 

  private mapeoTipos: { [key: string]: string } = {
    'herr': 'Herramientas',
    'pint': 'Pintura',
    'mate': 'Materiales',
    'mad': 'Madera',
    'made': 'Madera'
  };


constructor(private router: Router, private productoService: ApiproductoService) {

  const userData = localStorage.getItem('usuarioActual');
  this.usuarioActual = userData ? JSON.parse(userData) : null;  
  this.cargarProductos();
}

cargarProductos() {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data; // ← Importante: inicializar aquí
    });
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

buscar(event: any) {
  const termino = event.target.value?.toLowerCase().trim();

  if (!termino) {
    this.productosFiltrados = [...this.productos];
    return;
  }

  // Busca si hay un tipo asociado al término (ej: "herr" -> "Herramientas")
  const tipoAsociado = Object.entries(this.mapeoTipos).find(
    ([clave]) => termino.includes(clave)
  )?.[1];

  if (tipoAsociado) {
    // Filtra por tipo si hay una coincidencia
    this.productosFiltrados = this.productos.filter(p => p.tipo === tipoAsociado);
  } else {
    // Búsqueda genérica por título o descripción
    this.productosFiltrados = this.productos.filter(p =>
      p.titulo.toLowerCase().includes(termino) ||
      p.descripcion.toLowerCase().includes(termino)
    );
  }
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

  ngOnInit() { 
    this.productoService.obtenerProductos().subscribe(
      (res) => {
        this.productos = res;
        console.log('Productos:', res);
      },
      (error) => {
        console.error('Error al obtener productos', error);
      }
    );
  }
}
