import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiusuarioService } from 'src/app/services/apiusuario.service';




@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],  
  standalone: false
})
export class InicioSesionPage implements OnInit {
  usuarios: any[] = [];

  nombre: string = '';  
  contra: string = '';
  correo: string = '';
  usuario_aut: string = '';
  // Usuarios predefinidos

  constructor(private router: Router, private alertctrl: AlertController, private usuarioService: ApiusuarioService) { }

  IraCambiarContrasenna() {
    this.router.navigate(['/cambiar-contrasenna'])
  }

  IraCrearCuenta() {
    this.router.navigate(['/crear-cuenta'])
  }

  ngOnInit() {
  this.usuarioService.obtenerUsuarios().subscribe(
      (res) => {
        this.usuarios = res;
        console.log('Usuarios:', res);
      },
      (error) => {
        console.error('Error al obtener usuarios', error);
      }
    );
  localStorage.removeItem('usuarioActual');
}

async iniciarSesion() {
  // Buscar el usuario por correo y contraseña
  const usuarioEncontrado = this.usuarios.find(u => 
    u.correo === this.correo && u.contra === this.contra
  );

  if (usuarioEncontrado) {
    // Guardar usuario en localStorage
    const datosUsuario = {
    rut: usuarioEncontrado.rut,
    nombre: usuarioEncontrado.p_nombre,
    tipo_usuario: usuarioEncontrado.tipo_usuario
  };

  // Guardar como JSON en localStorage
  localStorage.setItem('usuarioActual', JSON.stringify(datosUsuario));

    // Mostrar mensaje de éxito
    const alert = await this.alertctrl.create({
      header: 'Acceso permitido',
      message: 'Inicio de sesión exitoso.',
      buttons: [{
        text: 'OK',
        handler: () => {
          // Redirigir según tipo de usuario
          switch (usuarioEncontrado.tipo_usuario) {
            case 'vendedor':
              this.router.navigate(['/inicio-vendedor']);
              break;
            case 'bodega':
              this.router.navigate(['/inicio-bodeguero']);
              break;
            case 'contador':
              this.router.navigate(['/inicio-contadorro']); // <-- corregido typo
              break;
            case 'admin':
              this.router.navigate(['/inicio-admin']);
              break;
            default:
              this.router.navigate(['/inicio']);
          }
        }
      }]
    });
    await alert.present();

  } else {
    const alert = await this.alertctrl.create({
      header: 'Acceso denegado',
      message: 'Correo o contraseña incorrectos.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
}