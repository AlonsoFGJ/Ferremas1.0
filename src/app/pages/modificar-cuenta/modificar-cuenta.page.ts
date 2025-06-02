import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { ApiusuarioService } from 'src/app/services/apiusuario.service';

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


  constructor(private router: Router, private alerctrl: AlertController, private usuarioService: ApiusuarioService) { }

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
    this.mostrarAlerta('Error: No hay sesión iniciada.');
    return;
  }

  const usuarioActual = JSON.parse(userData);
  const rutUsuario = usuarioActual.rut;

  // Creamos el objeto con los datos a actualizar
  const datosActualizados = {
    p_nombre: this.p_nombre,
    s_nombre: this.s_nombre,
    p_apellido: this.p_apellido,
    s_apellido: this.s_apellido,
    direccion: this.direccion,
    correo: this.correo,
    // No incluimos 'contra' aquí, salvo que también quieras actualizarla
  };

  // Llamamos al servicio para actualizar en el backend
  this.usuarioService.actualizarUsuario(rutUsuario, datosActualizados).subscribe(
    (res: any) => {
      console.log('Usuario actualizado en el servidor:', res);

      // Actualizamos el usuario en localStorage
      const usuarioActualizado = {
        ...usuarioActual,
        ...datosActualizados
      };

      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));

      this.mostrarAlerta('Los datos han sido actualizados correctamente.');
    },
    (error) => {
      console.error('Error al actualizar el usuario en el servidor', error);
      this.mostrarAlerta('Hubo un error al guardar los cambios. Inténtalo más tarde.');
    }
  );
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

  

  ionViewWillEnter() {
  const userData = localStorage.getItem('usuarioActual');
  if (userData) {
    const user = JSON.parse(userData);
    const rutUsuario = user.rut;

    // Llamamos al servicio para obtener los datos más recientes desde la API
    this.usuarioService.obtenerUsuario(rutUsuario).subscribe(
      (res: any) => {
        console.log('Datos del usuario desde API:', res);

        // Asignamos los valores a los campos del formulario
        this.p_nombre = res.p_nombre || '';
        this.s_nombre = res.s_nombre || '';
        this.p_apellido = res.p_apellido || '';
        this.s_apellido = res.s_apellido || '';
        this.direccion = res.direccion || '';
        this.correo = res.correo || '';
        this.rut = res.rut || '';

      },
      (error) => {
        console.error('Error al obtener usuario por RUT', error);
        this.mostrarAlerta('No se pudieron cargar los datos del usuario.');
      }
    );
  } else {
    console.warn('No hay usuario logueado en localStorage');
    this.router.navigate(['/inicio-sesion']);
  }
}

  ngOnInit() {
  }

}
