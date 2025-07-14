import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiusuarioService } from 'src/app/services/apiusuario.service';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.page.html',
  styleUrls: ['./crear-cuenta.page.scss'],
  standalone: false
})
export class CrearCuentaPage implements OnInit {
  rut: string = "";
  tipo_usuario: string = "";
  p_nombre: string = "";
  s_nombre: string = "";
  p_apellido: string = "";
  s_apellido: string = "";
  direccion: string = "";
  correo: string = "";
  contra: string = "";
  contra2: string = "";

  
  constructor(private router: Router, private alertctrl: AlertController, private usuarioService: ApiusuarioService) { }

  validarRut(rutCompleto: string): boolean {
  if (!rutCompleto) return false;

  rutCompleto = rutCompleto.replace('‐', '-').toUpperCase();
  const rutSplit = rutCompleto.split('-');
  
  if (rutSplit.length !== 2) return false;

  const cuerpo = rutSplit[0];
  let dv = rutSplit[1];

  // Validar cuerpo del RUT
  if (dv.length !== 1) return false;
  if (isNaN(Number(cuerpo))) return false;

  const rutNumerico = Number(cuerpo);
  let factor = 2;
  let suma = 0;
  let rutInvertido = cuerpo.split('').reverse().join('');

  for (let i = 0; i < rutInvertido.length; i++) {
    suma += parseInt(rutInvertido[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const resto = suma % 11;
  const dvCalculado = 11 - resto;

  let dvEsperado = '';
  if (dvCalculado === 11) dvEsperado = '0';
  else if (dvCalculado === 10) dvEsperado = 'K';
  else dvEsperado = dvCalculado.toString();

  return dv.toUpperCase() === dvEsperado;
}

  async crearCuenta() {
    const minLength = 8;

    /*if (!this.p_nombre || !this.p_apellido || !this.rut || !this.correo || !this.contra || !this.contra2) {
      await this.presentAlert('ERROR!', 'Debes rellenar los campos obligatorios.');
      return;
    }*/

    if (!this.p_nombre) {
      await this.presentAlert('ERROR!', 'Debes ingresar un nombre');
      return;
    }

    if (!this.p_apellido) {
      await this.presentAlert('ERROR!', 'Debes ingresar un apellido');
      return;
    }

    if (!this.rut) {
      await this.presentAlert('ERROR!', 'Debes ingresar un RUT');
      return;
    }

    if (!this.correo) {
      await this.presentAlert('ERROR!', 'Debes ingresar un correo valido');
      return;
    }

    if (!this.contra) {
      await this.presentAlert('ERROR!', 'Debes ingresar una contraseña');
      return;
    }

    if (!this.contra) {
      await this.presentAlert('ERROR!', 'Debes ingresar una confirmación de contraseña');
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);
    if (!correoValido) {
      await this.presentAlert('Correo inválido', 'Por favor ingresa un correo válido.');
      return;
    }

    if (this.contra.length < minLength) {
      await this.presentAlert('ERROR!', `La contraseña debe tener al menos ${minLength} caracteres.`);
      return;
    }

    if (this.contra !== this.contra2) {
      await this.presentAlert('ERROR!', `Las contraseñas deben ser iguales.`);
      return;
    }

    if (!this.validarRut(this.rut)) {
      await this.presentAlert('RUT inválido', 'Por favor ingresa un RUT válido con su dígito verificador, sin puntos.');
      return;
    }

    const nuevoUsuario = {
      rut: this.rut,
      tipo_usuario: 'invitado',
      p_nombre: this.p_nombre,
      s_nombre: this.s_nombre,
      p_apellido: this.p_apellido,
      s_apellido: this.s_apellido,
      direccion: this.direccion,
      correo: this.correo,
      contra: this.contra
    };

    this.usuarioService.agregarUsuario(nuevoUsuario).subscribe({
      next: async (respuesta) => {
        const alert = await this.alertctrl.create({
          header: 'Registro correcto!',
          message: 'La cuenta fue creada exitosamente.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['/inicio']);
            }
          }]
        });
        await alert.present();
      },
      error: async (error) => {
        await this.presentAlert('Error al registrar', error?.error?.message || 'No se pudo registrar el usuario.');
      }
    });
  }

  IraInicio() {
    this.router.navigate(['/inicio']);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertctrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ngOnInit() {
  }

}
