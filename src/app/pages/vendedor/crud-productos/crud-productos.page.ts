import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crud-productos',
  templateUrl: './crud-productos.page.html',
  styleUrls: ['./crud-productos.page.scss'],
  standalone: false
})
export class CrudProductosPage implements OnInit {
  nombreUsuario: string = '';
  usuarioActual: any = null;
  editingIndex: number | null = null;
  tempStock: number = 0;
  tempPrecio: number = 0;

  private usuariosPredefinidos = [
    { usuario: 'admin', contrasenia: 'admin123' },
    { usuario: 'vendedor', contrasenia: 'vendedor123' },
    { usuario: 'contador', contrasenia: 'contador123' },
    { usuario: 'bodega', contrasenia: 'bodega1234' },
    { usuario: 'invitado', contrasenia: 'invitado123' }
  ];

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

  constructor(private router: Router, private alertCtrl: AlertController) { 
    this.usuarioActual = localStorage.getItem('usuario');
  }

  ionViewWillEnter() {
    const userData = localStorage.getItem('usuarioActual');
    if (userData) {
      const user = JSON.parse(userData);
      this.nombreUsuario = user.usuario;
    }
  }



  productos = [
    {
      imagen: 'assets/icon/cemento.png',
      titulo: 'Cemento Polpaico',
      subtitulo: '$4.350',
      precio: 4350,
      stock: 50
    },
    {
      imagen: 'assets/icon/destornillador-paleta.png',
      titulo: 'Destornillador punta paleta',
      subtitulo: '$4.990',
      precio: 4990,
      stock: 30
    },
    {
      imagen: 'assets/icon/plancha.png',
      titulo: 'Plancha OSB 11mm',
      subtitulo: '$19.670',
      precio: 19670,
      stock: 15
    },
    {
      imagen: 'assets/icon/yeso25.png',
      titulo: 'Yeso 25kg',
      subtitulo: '$8.990',
      precio: 8990,
      stock: 20
    },
    {
      imagen: 'assets/icon/destornillador-electrico.png',
      titulo: 'Destornillador Electrico',
      subtitulo: '$80.990',
      precio: 80990,
      stock: 8
    },
    {
      imagen: 'assets/icon/pintura.png',
      titulo: 'Pintura Multi-superficies',
      subtitulo: '$124.990',
      precio: 124990,
      stock: 12,
      tipo: 'pintura'
    },
    {
      imagen: 'assets/icon/plancha-volca.png',
      titulo: 'Plancha Volcanita 10 mm',
      subtitulo: '$6.590',
      precio: 6590,
      stock: 25
    },
    {
      imagen: 'assets/icon/escalera.png',
      titulo: 'Escalera multipropósito',
      subtitulo: '$74.990',
      precio: 74990,
      stock: 5
    },
    {
      imagen: 'assets/icon/yeso5.png',
      titulo: 'Yeso 5kg',
      subtitulo: '$2.590',
      precio: 2590,
      stock: 40
    },
    {
      imagen: 'assets/icon/yeso1.png',
      titulo: 'Yeso 1kg',
      subtitulo: '$690',
      precio: 690,
      stock: 60
    }
  ];

  ngOnInit() {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (!usuarioActual) {
      this.router.navigate(['/iniciosin']);
      return;
    }
  }

async editarProducto(index: number) {
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
          // Validación de valores negativos
          if (data.stock < 0 || data.precio < 0) {
            const errorAlert = await this.alertCtrl.create({
              header: 'Error',
              message: `No se permiten valores negativos para ${producto.titulo}`,
              buttons: ['OK']
            });
            await errorAlert.present();
            return false;
          }
          
          // Validación de otros valores
          if (data.stock >= 0 && data.precio > 0) {
            producto.stock = Number(data.stock);
            producto.precio = Number(data.precio);
            producto.subtitulo = `$${producto.precio.toLocaleString('es-CL')}`;
            if (producto.titulo.includes('c/u')) {
              producto.subtitulo += ' c/u';
            }
            return true;
          }
          return false;
        }
      }
    ]
  });

  await alert.present();
}

  getStockColor(stock: number): string {
    if (stock === 0) return 'danger';
    if (stock < 5) return 'warning';
    return 'success';
  }
}