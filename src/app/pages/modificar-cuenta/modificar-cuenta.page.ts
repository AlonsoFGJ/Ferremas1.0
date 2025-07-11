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


  constructor(private router: Router, private alertCtrl: AlertController, private usuarioService: ApiusuarioService) { }

  async mostrarAlerta(mensaje: string, header: string) {
  const alert = await this.alertCtrl.create({
    header: header,
    message: mensaje,
    buttons: ['OK']
  });
  await alert.present();
}

async mostrarConfirmacion(mensaje: string, header: string): Promise<boolean> {
  return new Promise(async (resolve) => {
    const alert = await this.alertCtrl.create({
      header: header,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => resolve(false)
        },
        {
          text: 'Eliminar',
          handler: () => resolve(true)
        }
      ]
    });
    await alert.present();
  });
}

  actualizarUsuario() {
  const userData = localStorage.getItem('usuarioActual');

  if (!userData) {
    console.error('No se encontró el usuario actual en la base de datos');
    this.mostrarAlerta('No hay sesión iniciada.', 'Error');
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

      this.mostrarAlerta('Los datos han sido actualizados correctamente.', 'Éxito');
    },
    (error) => {
      console.error('Error al actualizar el usuario en el servidor', error);
      this.mostrarAlerta('Hubo un error al guardar los cambios. Inténtalo más tarde.', 'Error');
    }
  );
}

async eliminarUsuario() {
  const userData = localStorage.getItem('usuarioActual');

  if (!userData) {
    console.error('No se encontró el usuario actual en la base de datos');
    this.mostrarAlerta('Error: No hay sesión iniciada.', 'Error');
    return;
  }

  const usuarioActual = JSON.parse(userData);
  const rutUsuario = usuarioActual.rut;

  // Mostrar confirmación usando AlertController
  const confirmado = await this.mostrarConfirmacion(
    '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
    'Confirmar eliminación'
  );

  if (!confirmado) return;

  // Llamamos al servicio para eliminar en el backend
  this.usuarioService.eliminarUsuario(rutUsuario).subscribe(
    (res: any) => {
      console.log('Usuario eliminado del servidor:', res);

      localStorage.removeItem('usuarioActual');

      this.mostrarAlerta('Tu cuenta ha sido eliminada exitosamente.', 'Éxito');

      this.router.navigate(['/iniciosin']);
    },
    (error) => {
      console.error('Error al eliminar el usuario en el servidor', error);
      this.mostrarAlerta('Hubo un error al eliminar la cuenta. Inténtalo más tarde.', 'Error');
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
        this.mostrarAlerta('No se pudieron cargar los datos del usuario.', 'Error');
      }
    );
  } else {
    console.warn('No hay usuario logueado en localStorage');
    this.router.navigate(['/inicio-sesion']);
  }
}

async ngOnInit() {
  const usuarioActual = localStorage.getItem('usuarioActual');

  if (!usuarioActual) {
    this.router.navigate(['/iniciosin']);
    return;
  }

  const usuarioActualStr = JSON.parse(usuarioActual);
  const tipoUsuario = usuarioActualStr.tipo_usuario?.trim();

  if (tipoUsuario == 'invitado') {
    // Usuario válido, se queda en la vista
    return;
  } else if (tipoUsuario == 'vendedor') {
    await this.mostrarAlerta(
      'La cuenta de tipo "Vendedor" no está habilitada para modificar esta sección.',
      'Acceso restringido'
    );
    this.router.navigate(['/inicio-vendedor']);
  } else if (tipoUsuario == 'contador') {
    await this.mostrarAlerta(
      'La cuenta de tipo "Contador" no está habilitada para modificar esta sección.',
      'Acceso restringido'
    );
    this.router.navigate(['/inicio-contadorro']);
  } else if (tipoUsuario == 'bodega') {
    await this.mostrarAlerta(
      'La cuenta de tipo "Bodega" no está habilitada para modificar esta sección.',
      'Acceso restringido'
    );
    this.router.navigate(['/inicio-bodeguero']);
  } else {
    // Tipo de usuario no reconocido
    this.router.navigate(['/iniciosin']);
  }
}

}
