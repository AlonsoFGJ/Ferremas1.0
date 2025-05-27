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
  }else if (!this.contra || this.contra.length < minLength) {
      const alert = await this.alertctrl.create({
        header: 'ERROR!',
        message: `La contraseña debe tener al menos ${minLength} caracteres.`,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }else if (this.contra !== this.contra2) {
      const alert = await this.alertctrl.create({
        header: 'ERROR!',
        message: `Las contraseñas deben ser iguales`,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }else {
      const alert = await this.alertctrl.create({
        header: 'Registro correcto!',
        message: `La cuenta fue creada exitosamente`,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/inicio'])
          }
        }]
      });
      await alert.present();
      return;
    }
  }

  IraInicio() {
    this.router.navigate(['/inicio'])
  }

  ngOnInit() {
  }

}
