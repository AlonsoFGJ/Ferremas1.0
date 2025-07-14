import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { ApipedidoService } from 'src/app/services/apipedido.service';
import { ApiCarrito } from 'src/app/services/apicarrito.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  standalone: false
})


export class PagoPage implements OnInit {
  
  descripcionPedido: string = '';
  rutUsuario: string = '';
  pedido: any = {};
  idCarrito: any = {};
  valorDolar: number = 0;
  totalCLP: number= 0;
  carrito: any[] = [];
  ultimoId: number = 0;
  siguienteIdPedido: number = 1;

  

  constructor(
    private indicadoresService: IndicadoresService,
    private CarritoService: CarritoService,
    private pedidoService: ApipedidoService,
    private route: ActivatedRoute,
    private router: Router,
    private apiCarrito: ApiCarrito,
    private alertctrl: AlertController
  ) { }

  

  ngOnInit() {
    
  // Obtener el RUT del usuario desde localStorage
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  const rut = usuarioActual.rut;

  if (!rut) {
    console.error('No se encontró el RUT del usuario en localStorage');
    return;
  }

  // Obtener el carrito asociado al RUT usando apiCarrito
  this.apiCarrito.getCarritoPorRut(rut).subscribe(carrito => {
    console.log('Carrito obtenido:', carrito);
    // Guardar los datos recuperados en variables locales
    this.idCarrito = carrito.id_carrito;
    this.descripcionPedido = carrito.descripcion_carrito; // Asegúrate de que el nombre sea correcto
    this.rutUsuario = carrito.rut_usuario; // O directamente usar "rut"
    this.totalCLP = carrito.precio_total;  // Si deseas mostrar el total
    this.totalCLP = this.calcularTotalConIVA(this.totalCLP);
    // También puedes preparar el objeto del pedido por adelantado si lo necesitas
    this.pedido = {
      descripcion_pedido: this.descripcionPedido,
      rut_usuario: this.rutUsuario,
      pago_comprobado: 'Pendiente'
    };

  }, error => {
    console.error('Error al obtener carrito por RUT:', error);
  });

  // Obtener valor dólar si es necesario para conversión
  this.obtenerValorDolar();

  this.pedidoService.obtenerUltimoIdPedido().subscribe({
  next: (respuesta) => {
    this.siguienteIdPedido = respuesta.ultimo_id + 1;
  },
  error: (err) => {
    console.error('Error al obtener el último id_pedido', err);
  }
});
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

            // 1. Obtener usuario actual y su RUT
            const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
            const rutUsuario = usuarioActual.rut;

            if (!rutUsuario) {
              console.error('No se encontró el RUT del usuario');
              return;
            }

            // 2. Obtener carrito por RUT
            this.apiCarrito.getCarritoPorRut(rutUsuario).subscribe(carrito => {
              console.log('Carrito recuperado:', carrito);

              // 3. Armar objeto para el pedido
              const nuevoPedido = {
                descripcion_pedido: carrito.descripcion_carrito, // Puede ajustarse según nombre exacto del campo
                rut_usuario: carrito.rut_usuario,
                pago_comprobado: 'Pago verificado en Paypal'
              };

              // 4. Crear pedido con API
              this.apiCarrito.eliminarCarritoRut(rutUsuario).subscribe({
                next: () => {
                  console.log('Carrito eliminado del backend');

                  this.CarritoService.vaciarCarrito(); // ✅ Ahora sí se ejecuta el método
                  console.log('Carrito local vaciado');

                  this.pedidoService.agregarPedido(nuevoPedido).subscribe(res => {
                    console.log('Pedido agregado:', res);
                    this.mostrarAlerta('Exito', 'Su pedido fue agregado exitosamente');
                    this.router.navigate(['/inicio']);
                  }, err => {
                    console.error('Error al agregar pedido:', err);
                  });

                },
                error: err => {
                  console.error('Error al eliminar carrito:', err);    
                }
              });
            }, error => {
              console.error('Error al obtener carrito:', error);
            });
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

crearPedido() {
  // 1. Obtener usuario actual y su RUT
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  const rutUsuario = usuarioActual.rut;

  if (!rutUsuario) {
    console.error('No se encontró el RUT del usuario');
    return;
  }

  // 2. Obtener carrito por RUT
  this.apiCarrito.getCarritoPorRut(rutUsuario).subscribe(carrito => {
    console.log('Carrito recuperado:', carrito);

    // 3. Armar objeto para el pedido
    const nuevoPedido = {
      descripcion_pedido: carrito.descripcion_carrito, // Asegúrate que este campo exista
      rut_usuario: carrito.rut_usuario,
      pago_comprobado: 'Pendiente'
    };

    // 4. Eliminar carrito y crear pedido
    this.apiCarrito.eliminarCarritoRut(rutUsuario).subscribe({
      next: () => {
        console.log('Carrito eliminado del backend');
        this.CarritoService.vaciarCarrito(); // Vacía el carrito local
        console.log('Carrito local vaciado');

        this.pedidoService.agregarPedido(nuevoPedido).subscribe(res => {
          console.log('Pedido agregado:', res);
          this.mostrarAlerta('Exito', 'Su pedido pasó a revisión');
          this.router.navigate(['/inicio']);
        }, err => {
          console.error('Error al agregar pedido:', err);
        });
      },
      error: err => {
        console.error('Error al eliminar carrito:', err);
      }
    });
  }, error => {
    console.error('Error al obtener carrito:', error);
  });
}

calcularTotalConIVA(monto: number): number {
  const iva = 0.19;
  return monto + (monto * iva);
}

async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertctrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  

}
