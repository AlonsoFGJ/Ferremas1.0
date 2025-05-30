import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.page.html',
  styleUrls: ['./crear-cuenta.page.scss'],
  standalone: false
})
export class CrearCuentaPage implements OnInit {
  usuario: string = "";
  nombre: string = "";
  correo: string = "";
  contra: string = "";
  contra2: string = "";

  

  constructor(private router: Router, private alertctrl: AlertController) { }

  async crearCuenta() {
  const minLength = 8;
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);

  if (!correoValido) {
    const alert = await this.alertctrl.create({
      header: 'Correo inválido',
      message: 'Por favor ingresa un correo válido.',
      buttons: ['OK'],
    });
    await alert.present();
    return;

  } else if (!this.contra || this.contra.length < minLength) {
    const alert = await this.alertctrl.create({
      header: 'ERROR!',
      message: `La contraseña debe tener al menos ${minLength} caracteres.`,
      buttons: ['OK']
    });
    await alert.present();
    return;

  } else if (this.contra !== this.contra2) {
    const alert = await this.alertctrl.create({
      header: 'ERROR!',
      message: `Las contraseñas deben ser iguales`,
      buttons: ['OK']
    });
    await alert.present();
    return;

  } else {
    // Asignar nombre de usuario automático
    const usuarioAsignado = 'invitado';

    // Obtener usuarios existentes
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');

    // Crear nuevo usuario
    const nuevoUsuario = {
      usuario: usuarioAsignado,
      nombre: this.nombre,             // ← nuevo campo ingresado por el usuario
      correo: this.correo,
      contrasenia: this.contra
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosGuardados));

    const alert = await this.alertctrl.create({
      header: 'Registro correcto!',
      message: `La cuenta fue creada exitosamente`,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/inicio']); // Redirige al login
        }
      }]
    });
    await alert.present();
  }
}

  
  

  IraInicio() {
    this.router.navigate(['/inicio'])
  }

  ngOnInit() {
  }

}
