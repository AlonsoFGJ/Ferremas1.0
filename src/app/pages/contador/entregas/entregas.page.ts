import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApipedidoService } from 'src/app/services/apipedido.service';
import { ApiusuarioService } from 'src/app/services/apiusuario.service';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.page.html',
  styleUrls: ['./entregas.page.scss'],
  standalone: false
})
export class EntregasPage implements OnInit {
  nombreUsuario: string = '';
  fechaActual: Date = new Date();
  entregas: any[] = [];

  constructor(
    private router: Router,
    private alertctrl: AlertController,
    private apiPedido: ApipedidoService,
    private apiUsuario: ApiusuarioService
  ) {}

  ngOnInit() {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (!usuarioActual) {
      this.router.navigate(['/iniciosin']);
      return;
    }

    const usuarioActualStr = JSON.parse(usuarioActual);
    this.nombreUsuario = usuarioActualStr.usuario;

    if (usuarioActualStr.tipo_usuario !== 'contador') {
      this.router.navigate(['/iniciosin']);
      return;
    }

    this.cargarEntregas();
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

  async cargarEntregas() {
    try {
      const pedidos = await this.apiPedido.obtenerPedidos().toPromise();

      this.entregas = await Promise.all(
        pedidos.map(async (pedido: any) => {
          const rut = pedido.rut_usuario;
          const usuario = await this.apiUsuario.obtenerUsuario(rut).toPromise();          
          return {
            id: pedido.id_pedido,
            nombre: `${usuario.p_nombre} ${usuario.p_apellido}`,
            descripcion: pedido.descripcion_pedido,
            pagado: pedido.pago_comprobado,
            rut: rut
          };
          
        })
      );
      console.log('Datos de entregas:', this.entregas); // Agregar esta línea
    } catch (error) {
      console.error('Error cargando entregas:', error);
    }
  }

  

 togglePagoConfirmado(pedido: any) {
  if (pedido.pagado === 'Pendiente') {
    pedido.pagado = 'Confirmado';
    pedido.modificado = true; // Marca el pedido como modificado
  }
}

  // Confirma los cambios a la API
  confirmarCambios() {
  const cambiosPendientes = this.entregas.filter(p => p.modificado);

  if (cambiosPendientes.length === 0) {
    this.alertctrl.create({
      header: 'Sin cambios',
      message: 'No hay cambios pendientes por confirmar.',
      buttons: ['OK']
    }).then(alert => alert.present());
    return;
  }

  cambiosPendientes.forEach(pedido => {
    this.apiPedido.actualizarParcialPedido(pedido.id, {
      pago_comprobado: pedido.pagado // Asegúrate de usar el campo correcto
    }).subscribe({
      next: () => {
        pedido.modificado = false; // Limpiar el flag después de guardar
      },
      error: (err) => {
        console.error(`Error actualizando pedido ${pedido.id}:`, err);
      }
    });
  });

  this.alertctrl.create({
    header: 'Cambios confirmados',
    message: 'Se han aplicado los cambios correctamente.',
    buttons: ['OK']
  }).then(alert => alert.present());
}

tienePagosPendientes(): boolean {
  return this.entregas.some(p => p.pagado === 'Pendiente');
}

}
