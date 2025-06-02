import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { ApipedidoService } from 'src/app/services/apipedido.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  standalone: false
})
export class PagoPage implements OnInit {
  

  valorDolar: number = 0;
  totalCLP: number= 0;
  carrito: any[] = [];

  constructor(
    private indicadoresService: IndicadoresService,
    private CarritoService: CarritoService,
    private pedidoService: ApipedidoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
    const id_pedido = params['id_pedido'];

    if (id_pedido) {
      this.pedidoService.obtenerPedido(id_pedido).subscribe(pedido => {
        console.log('Datos recibidos:', pedido);

      // Reasignamos los valores a sus campos correctos
      const pedidoCorregido = {
        id_pedido: pedido.id_pedido,
        rut_usuario: pedido.descripcion_carrito, // Aquí estaba el RUT
        descripcion_carrito: pedido.precio_total, // Aquí estaba la descripción
        precio_total: Number(pedido.pago_comprobado), // Aquí estaba el total como número
        pago_comprobado: pedido.pago_comprobado // Puede quedar así o manejarlo después
  };

  console.log('Pedido corregido:', pedidoCorregido);

  this.totalCLP = pedidoCorregido.precio_total;
      });
    }
  });
    this.obtenerValorDolar();

  }

  obtenerValorDolar() {
    this.indicadoresService.getDolar().subscribe({
      next: (data) => {
        this.valorDolar = data.serie[0].valor;
        console.log('Valor del dólar:', this.valorDolar);
      },
      error: (err) => {
        console.error('Error al obtener valor del dólar:', err);
      }
    });
  }

  calcularTotalCarrito(): number{
    return this.carrito.reduce((total, producto) =>{
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }

  convertirPesosADolares(pesos: number): number {
    return this.valorDolar ? pesos / this.valorDolar : 0;
  }
  

  ngAfterViewInit() {
  setTimeout(() => {
    const paypal = (window as any).paypal;
    if (paypal) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          const montoUSD = this.convertirPesosADolares(this.totalCLP).toFixed(2);
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: montoUSD
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Pago realizado por ' + details.payer.name.given_name);
          });
        },
        onError: (err: any) => {
          console.error('Error en el pago:', err);
        }
      }).render('#paypal-button-container');
    } else {
      console.error('PayPal SDK no está disponible.');
    }
  }, 500);
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
