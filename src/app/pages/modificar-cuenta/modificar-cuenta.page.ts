import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modificar-cuenta',
  templateUrl: './modificar-cuenta.page.html',
  styleUrls: ['./modificar-cuenta.page.scss'],
  standalone: false
})
export class ModificarCuentaPage implements OnInit {
  nombreUsuario: string = '';
  usuarioActual: any = null;
  usuarioRegis: any = null;
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

  private usuariosPredefinidos = [
    { usuario: 'admin', contrasenia: 'admin123' },
    { usuario: 'vendedor', contrasenia: 'vendedor123' },
    { usuario: 'contador', contrasenia: 'contador123' },
    { usuario: 'bodega', contrasenia: 'bodega1234' },
    { usuario: 'invitado', contrasenia: 'invitado123' }
  ];

  constructor(private router: Router, private alerctrl: AlertController) { }

  async mostrarAlerta(mensaje: string) {
  const alert = await this.alerctrl.create({
    header: 'Éxito',
    message: mensaje,
    buttons: ['OK'],
  });

  await alert.present();
}

  actualizarUsuario() {
  const userData = localStorage.getItem('usuarioActual');

  if (!userData) {
    console.error('No se encontró el usuario actual en localStorage');
    return;
  }

  const usuarioActual = JSON.parse(userData);

  // Crear un nuevo objeto con los datos actualizados
  const usuarioActualizado = {
    ...usuarioActual,
    p_nombre: this.p_nombre,
    s_nombre: this.s_nombre,
    p_apellido: this.p_apellido,
    s_apellido: this.s_apellido,
    correo: this.correo,
    direccion: this.direccion,
    rut: this.rut
    // No incluimos "contra" ni "contra2", así que se mantiene la original
  };

  // 1. Actualizamos 'usuarioActual'
  localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));

  // 2. Actualizamos también en 'usuariosRegistrados'
  const usuariosRegistradosJSON = localStorage.getItem('usuariosRegistrados');

  if (usuariosRegistradosJSON) {
    let usuariosRegistrados = JSON.parse(usuariosRegistradosJSON);

    // Buscamos el índice del usuario actual usando el campo 'rut' como clave única
    const index = usuariosRegistrados.findIndex(
      (u: any) => u.rut === usuarioActualizado.rut
    );

    if (index !== -1) {
      // Reemplazamos el usuario antiguo por el actualizado
      usuariosRegistrados[index] = usuarioActualizado;

      // Guardamos de nuevo la lista completa
      localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
      console.log('Usuario actualizado en usuariosRegistrados.');
    } else {
      console.warn('No se encontró el usuario en usuariosRegistrados usando su RUT');
    }
  } else {
    console.warn('No se encontraron usuarios registrados en localStorage');
  }

  // Mostrar alerta al usuario
  this.mostrarAlerta('Los datos han sido actualizados correctamente');
}

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

  

  ionViewWillEnter() {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);

    this.p_nombre = user.p_nombre || "";
    this.s_nombre = user.s_nombre || "";
    this.p_apellido = user.p_apellido || "";
    this.s_apellido = user.s_apellido || "";
    this.rut = user.rut || "";
    this.direccion = user.direccion || "";
    this.correo = user.correo || "";
  }
}

  ngOnInit() {
  }

}
