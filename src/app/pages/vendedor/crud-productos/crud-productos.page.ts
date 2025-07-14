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

  nuevoProducto: {
  id_producto: number | null,
  titulo: string,
  descripcion: string,
  stock: number,
  precio: number,
  tipo: string
} = {
  id_producto: null,
  titulo: '',
  descripcion: '',
  stock: 0,
  precio: 0,
  tipo: 'herr'
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

  agregarProducto() {
  if (!this.nuevoProducto.titulo || this.nuevoProducto.precio <= 0 || this.nuevoProducto.stock < 0) {
    this.alertCtrl.create({
      header: 'Error',
      message: 'Todos los campos obligatorios deben completarse correctamente.',
      buttons: ['OK']
    }).then(a => a.present());
    return;
  }

  // 🆕 Generar nuevo id_producto = máximo existente + 1
  const maxId = Math.max(...this.productos.map(p => p.id_producto), 0);
  this.nuevoProducto.id_producto = maxId + 1;

  this.productoService.agregarProducto(this.nuevoProducto).subscribe(
    async () => {
      this.cargarProductos(); // Refresca la lista
      this.nuevoProducto = {
        id_producto: null,
        titulo: '',
        descripcion: '',
        stock: 0,
        precio: 0,
        tipo: 'herr'
      };
      const success = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'Producto agregado exitosamente.',
        buttons: ['OK']
      });
      await success.present();
    },
    async () => {
      const error = await this.alertCtrl.create({
        header: 'Error',
        message: 'Error al agregar el producto.',
        buttons: ['OK']
      });
      await error.present();
    }
  );
}




  async eliminarProducto(id: number, titulo: string) {
    const confirmAlert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro que desea eliminar el producto ${titulo}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.productoService.eliminarProducto(id).subscribe(
              async () => {
                this.cargarProductos();
                const successAlert = await this.alertCtrl.create({
                  header: 'Eliminado',
                  message: 'Producto eliminado correctamente.',
                  buttons: ['OK']
                });
                await successAlert.present();
              },
              async () => {
                const errorAlert = await this.alertCtrl.create({
                  header: 'Error',
                  message: 'No se pudo eliminar el producto.',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            );
          }
        }
      ]
    });

    await confirmAlert.present();
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
        name: 'titulo',
        type: 'text',
        placeholder: 'Título del producto',
        value: producto.titulo || ''
      },
      {
        name: 'descripcion',
        type: 'text',
        placeholder: 'Descripción',
        value: producto.descripcion || ''
      },
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
          const nuevoTitulo = data.titulo?.trim();
          const nuevaDescripcion = data.descripcion?.trim();
          const nuevoStock = Number(data.stock);
          const nuevoPrecio = Number(data.precio);

          if (nuevoStock < 0 || nuevoPrecio < 0) {
            const errorAlert = await this.alertCtrl.create({
              header: 'Error',
              message: `No se permiten valores negativos para ${producto.titulo}`,
              buttons: ['OK']
            });
            await errorAlert.present();
            return false;
          }

          if (nuevoStock >= 0 && nuevoPrecio > 0 && nuevoTitulo) {
            // Actualiza localmente
            producto.titulo = nuevoTitulo;
            producto.descripcion = nuevaDescripcion;
            producto.stock = nuevoStock;
            producto.precio = nuevoPrecio;
            producto.subtitulo = `$${producto.precio.toLocaleString('es-CL')}`;
            if (producto.titulo.includes('c/u')) {
              producto.subtitulo += ' c/u';
            }

            try {
              await this.productoService.actualizarParcial(producto.id_producto, {
                titulo: producto.titulo,
                descripcion: producto.descripcion ?? '',
                stock: producto.stock,
                precio: producto.precio,
                tipo: producto.tipo ?? ''
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