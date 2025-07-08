import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiproductoService } from 'src/app/services/apiproducto.service';

@Component({
  selector: 'app-crud-productos',
  templateUrl: './crud-productos.page.html',
  styleUrls: ['./crud-productos.page.scss'],
  standalone: false
})
export class CrudProductosPage implements OnInit {
  productos: any[] = [];
  nombreUsuario: string = '';
  usuarioActual: any = null;
  editingIndex: number | null = null;
  tempStock: number = 0;
  tempPrecio: number = 0;
  productosFiltrados: any[] = []; 
  terminoBusqueda: string = ''; 

  private mapeoTipos: { [key: string]: string } = {
    'herr': 'Herramientas',
    'pint': 'Pintura',
    'mate': 'Materiales',
    'mad': 'Madera',
    'made': 'Madera'
  };


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

  constructor(private router: Router, private alertCtrl: AlertController, private productoService: ApiproductoService) { 
    this.usuarioActual = localStorage.getItem('tipo_usuario');
    
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data; // ← Importante: inicializar aquí
    });
  }

  ionViewWillEnter() {
    const userData = localStorage.getItem('usuarioActual');
    if (userData) {
      const user = JSON.parse(userData);
      this.nombreUsuario = user.usuario;
    }
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

  
  

async actualizarProducto(index: number) {
  const producto = this.productos[index];
  this.editingIndex = index;
  this.tempStock = producto.stock;
  this.tempPrecio = producto.precio;

  const alert = await this.alertCtrl.create({
    header: `MODIFICAR: ${producto.titulo}`,
    message: `precio: $${producto.precio.toLocaleString('es-CL')} stock: ${producto.stock}`,
    inputs: [
      {
        name: 'stock',
        type: 'number',
        placeholder: 'Stock disponible',
        value: producto.stock,
        min: 0
      },
      {
        name: 'precio',
        type: 'number',
        placeholder: 'Precio ($)',
        value: producto.precio,
        min: 1
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          this.editingIndex = null;
        }
      },
      {
        text: 'Guardar',
        handler: async (data) => {
          const nuevoStock = Number(data.stock);
          const nuevoPrecio = Number(data.precio);

          // Validaciones
          if (nuevoStock < 0 || nuevoPrecio < 0) {
            const errorAlert = await this.alertCtrl.create({
              header: 'Error',
              message: `No se permiten valores negativos para ${producto.titulo}`,
              buttons: ['OK']
            });
            await errorAlert.present();
            return false;
          }

          if (nuevoStock >= 0 && nuevoPrecio > 0) {
            // Actualiza localmente
            producto.stock = nuevoStock;
            producto.precio = nuevoPrecio;
            producto.subtitulo = `$${producto.precio.toLocaleString('es-CL')}`;
            if (producto.titulo.includes('c/u')) {
              producto.subtitulo += ' c/u';
            }

            // 🔁 Actualiza en la base de datos
            try {
              await this.productoService.actualizarParcial(producto.id_producto, {
                titulo: producto.titulo,
                descripcion: producto.descripcion ?? '', // fallback en caso de que no exista
                stock: producto.stock,
                precio: producto.precio,
                tipo: producto.tipo ?? '' // opcionalmente maneja campos no definidos
              }).toPromise();

              const successAlert = await this.alertCtrl.create({
                header: 'Éxito',
                message: 'Producto actualizado exitosamente.',
                buttons: ['OK']
              });
              await successAlert.present();

              return true;              
            } catch (error) {
              const errorAlert = await this.alertCtrl.create({
                header: 'Error',
                message: `Error al actualizar producto en el servidor.`,
                buttons: ['OK']
              });
              await errorAlert.present();
              return false;
            }
          }

          return false;
        }
      }
    ]
  });

  await alert.present();
}
}