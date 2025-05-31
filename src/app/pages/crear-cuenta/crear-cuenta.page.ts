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
  p_nombre: string = "";
  s_nombre: string = "";
  p_apellido: string = "";
  s_apellido: string = "";
  direccion: string = "";
  rut: string = "";
  correo: string = "";
  contra: string = "";
  contra2: string = "";

  
  constructor(private router: Router, private alertctrl: AlertController) { }

  validarRut(rutCompleto: string): boolean {
  if (!rutCompleto) return false;

  rutCompleto = rutCompleto.replace('‐', '-').toUpperCase();
  const rutSplit = rutCompleto.split('-');
  
  if (rutSplit.length !== 2) return false;

  const cuerpo = rutSplit[0];
  let dv = rutSplit[1];

  // Validar cuerpo del RUT
  if (dv.length !== 1 && dv !== 'K') return false;
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

  // Verificar campos vacíos
  if (!this.p_nombre || !this.p_apellido || !this.rut || !this.correo || !this.contra || !this.contra2) {
    const alert = await this.alertctrl.create({
      header: 'ERROR!',
      message: 'Debes rellenar los campos obligatorios.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Validar correo
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);
  if (!correoValido) {
    const alert = await this.alertctrl.create({
      header: 'Correo inválido',
      message: 'Por favor ingresa un correo válido.',
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }

  // Validar contraseña mínima longitud
  if (this.contra.length < minLength) {
    const alert = await this.alertctrl.create({
      header: 'ERROR!',
      message: `La contraseña debe tener al menos ${minLength} caracteres.`,
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Validar coincidencia de contraseñas
  if (this.contra !== this.contra2) {
    const alert = await this.alertctrl.create({
      header: 'ERROR!',
      message: `Las contraseñas deben ser iguales`,
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Validar RUT chileno
  if (!this.validarRut(this.rut)) {
    const alert = await this.alertctrl.create({
      header: 'RUT inválido',
      message: 'Por favor ingresa un RUT válido con su dígito verificador, sin puntos.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Asignar nombre de usuario automático (puedes personalizarlo si quieres)
  const usuarioAsignado = 'invitado';

  // Obtener usuarios existentes
  const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');

  // Crear nuevo usuario
  const nuevoUsuario = {
    usuario: usuarioAsignado,
    p_nombre: this.p_nombre,
    s_nombre: this.s_nombre,
    p_apellido: this.p_apellido,
    s_apellido: this.s_apellido,
    direccion: this.direccion,
    rut: this.rut,
    correo: this.correo,
    contrasenia: this.contra
  };

  // Verificar si el correo ya está registrado
  const existeCorreo = usuariosGuardados.some((u: any) => u.correo === this.correo);
  if (existeCorreo) {
    const alert = await this.alertctrl.create({
      header: 'Correo duplicado',
      message: 'Este correo ya está registrado. Por favor usa otro.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Guardar usuario
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

  
  

  IraInicio() {
    this.router.navigate(['/inicio'])
  }

  ngOnInit() {
  }

}
