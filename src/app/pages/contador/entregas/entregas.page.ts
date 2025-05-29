import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.page.html',
  styleUrls: ['./entregas.page.scss'],
  standalone: false
})
export class EntregasPage implements OnInit {
  nombreUsuario: string = '';
  fechaActual: Date = new Date();
  
  // Datos de ejemplo para las entregas
  entregas = [
    { nombre: 'Juan Pérez', producto: 'Martillo', cantidad: 2, monto: 15000, entregado: false, pagado: true },
    { nombre: 'María González', producto: 'Destornilladores', cantidad: 5, monto: 25000, entregado: true, pagado: true },
    { nombre: 'Carlos López', producto: 'Pintura', cantidad: 3, monto: 35000, entregado: true, pagado: false },
    { nombre: 'Ana Silva', producto: 'Clavos', cantidad: 100, monto: 5000, entregado: false, pagado: false }
  ];

  constructor(private router: Router, private alertctrl: AlertController) { }

  ionViewWillEnter() {
    const userData = localStorage.getItem('usuarioActual');
    if (userData) {
      const user = JSON.parse(userData);
      this.nombreUsuario = user.usuario;
    }
  }

  ngOnInit() {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (!usuarioActual) {
      this.router.navigate(['/iniciosin']);
      return;
    }
  }

  // Cambia el estado de entrega
  cambiarEstadoEntrega(index: number) {
    this.entregas[index].entregado = !this.entregas[index].entregado;
  }

  // Cambia el estado de pago
  cambiarEstadoPago(index: number) {
    this.entregas[index].pagado = !this.entregas[index].pagado;
  }

  // Calcula el monto total de todas las entregas
  get montoTotal(): number {
    return this.entregas.reduce((total, entrega) => total + entrega.monto, 0);
  }

  // Calcula el monto pagado
  get montoPagado(): number {
    return this.entregas
      .filter(entrega => entrega.pagado)
      .reduce((total, entrega) => total + entrega.monto, 0);
  }

  // Cuenta las entregas completadas
  get entregasCompletadas(): number {
    return this.entregas.filter(entrega => entrega.entregado).length;
  }

  // Función para simular la descarga del documento
  async descargarDocumento() {
    const alert = await this.alertctrl.create({
      header: 'Descargar Documento',
      message: 'El documento de entrega se ha generado correctamente.',
      buttons: ['Aceptar']
    });
    
    await alert.present();
    
    // Aquí iría la lógica real para generar y descargar el documento
    console.log('Documento descargado');
  }
}