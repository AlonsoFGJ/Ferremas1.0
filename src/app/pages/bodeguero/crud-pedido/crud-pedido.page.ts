import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface ProductoPedido {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

interface Pedido {
  id: number;
  cliente: string;
  fecha: Date;
  productos: ProductoPedido[];
  direccion: string;
  estado: 'Pendiente' | 'Enviado';
  pagado: boolean;
  metodoPago?: 'Efectivo' | 'Tarjeta' | 'Transferencia';
}

@Component({
  selector: 'app-crud-pedido',
  templateUrl: './crud-pedido.page.html',
  styleUrls: ['./crud-pedido.page.scss'],
  standalone: false
})
export class CrudPedidoPage implements OnInit {
  productos: any[] = [];

  nombreUsuario: string = '';
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  filtroActual: string = 'todos';
  terminoBusqueda: string = '';

  constructor(private router: Router, private alertctrl: AlertController) { }

  ionViewWillEnter() {
    const userData = localStorage.getItem('usuarioActual');
    if (userData) {
      const user = JSON.parse(userData);
      this.nombreUsuario = user.usuario;
    }
    this.cargarPedidos();
  }

  ngOnInit() {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (!usuarioActual) {
      this.router.navigate(['/iniciosin']);
      return;
    }
  }

  cargarPedidos() {
    // Datos de ejemplo - en producción vendrían de una API
    this.pedidos = [
      {
        id: 1001,
        cliente: 'Juan Pérez',
        fecha: new Date(2025, 4, 15),
        productos: [
          { id: 1, nombre: 'Martillo profesional', precio: 12500, cantidad: 1, imagen: '/assets/icon/cemento.png' },
          { id: 2, nombre: 'Clavos acero 1kg', precio: 4500, cantidad: 2, imagen: '/assets/icon/cemento.png' }
        ],
        direccion: 'Av. Principal 123, Santiago',
        estado: 'Pendiente',
        pagado: true,
        metodoPago: 'Tarjeta'
      },
      {
        id: 1002,
        cliente: 'María González',
        fecha: new Date(2025, 4, 16),
        productos: [
          { id: 3, nombre: 'Taladro inalámbrico', precio: 34990, cantidad: 1, imagen: '/assets/icon/cemento.png'  },
          { id: 4, nombre: 'Broca conjunto 10pzs', precio: 8990, cantidad: 1, imagen: '/assets/icon/cemento.png'  }
        ],
        direccion: 'Calle Secundaria 456, Providencia',
        estado: 'Enviado',
        pagado: true,
        metodoPago: 'Transferencia'
      },
      {
        id: 1003,
        cliente: 'Carlos Muñoz',
        fecha: new Date(2025, 4, 17),
        productos: [
          { id: 5, nombre: 'Pintura blanca 4L', precio: 12990, cantidad: 3, imagen: '/assets/icon/cemento.png'  },
          { id: 6, nombre: 'Rodillo profesional', precio: 5990, cantidad: 2, imagen: '/assets/icon/cemento.png'  }
        ],
        direccion: 'Pasaje Los Aromos 789, Ñuñoa',
        estado: 'Pendiente',
        pagado: false
      }
    ];
    
    this.filtrarPedidos();
  }

  calcularTotal(pedido: Pedido): number {
    return pedido.productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }

  filtrarPedidos(event?: any) {
    if (event) {
      this.filtroActual = event.detail.value;
    }
    
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      // Aplicar filtro de estado
      if (this.filtroActual === 'pendientes' && pedido.estado !== 'Pendiente') return false;
      if (this.filtroActual === 'enviados' && pedido.estado !== 'Enviado') return false;
      
      // Aplicar búsqueda si hay término
      if (this.terminoBusqueda) {
        const term = this.terminoBusqueda.toLowerCase();
        return (
          pedido.id.toString().includes(term) ||
          pedido.cliente.toLowerCase().includes(term) ||
          pedido.direccion.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  }

  buscarPedidos(event: any) {
    this.terminoBusqueda = event.target.value.toLowerCase();
    this.filtrarPedidos();
  }

  async marcarComoEnviado(pedido: Pedido) {
    if (!pedido.pagado) {
      const alert = await this.alertctrl.create({
        header: 'Pedido no pagado',
        message: 'No puedes enviar un pedido que no ha sido pagado.',
        buttons: ['Entendido']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertctrl.create({
      header: 'Confirmar envío',
      message: `¿Estás seguro de marcar el pedido #${pedido.id} como enviado?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: () => {
            pedido.estado = 'Enviado';
            this.filtrarPedidos();
          }
        }
      ]
    });
    
    await alert.present();
  }

  async marcarComoPagado(pedido: Pedido) {
    const alert = await this.alertctrl.create({
      header: 'Método de pago',
      inputs: [
        {
          name: 'metodo',
          type: 'radio',
          label: 'Efectivo',
          value: 'Efectivo',
          checked: true
        },
        {
          name: 'metodo',
          type: 'radio',
          label: 'Tarjeta',
          value: 'Tarjeta'
        },
        {
          name: 'metodo',
          type: 'radio',
          label: 'Transferencia',
          value: 'Transferencia'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            if (data) {
              pedido.pagado = true;
              pedido.metodoPago = data;
              this.filtrarPedidos();
            }
          }
        }
      ]
    });
    
    await alert.present();
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
}

