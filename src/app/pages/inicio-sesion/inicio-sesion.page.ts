import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],  
  standalone: false
})
export class InicioSesionPage implements OnInit {
  nombre: string = '';
  usuario: string = '';
  contrasenia: string = '';
  
  // Usuarios predefinidos
  private usuariosPredefinidos = [
    { usuario: 'admin', contrasenia: 'admin123' },
    { usuario: 'vendedor', contrasenia: 'vendedor123' },
    { usuario: 'contador', contrasenia: 'contador123' },
    { usuario: 'bodega', contrasenia: 'bodega1234' },
    { usuario: 'invitado', contrasenia: 'invitado123' }
  ];

  constructor(private router: Router, private alertctrl: AlertController) { }

  IraCambiarContrasenna() {
    this.router.navigate(['/cambiar-contrasenna'])
  }

  IraCrearCuenta() {
    this.router.navigate(['/crear-cuenta'])
  }

  ngOnInit() {
    localStorage.removeItem('usuarioActual');
    // Verificar si hay usuarios guardados en localStorage, si no, cargar los predefinidos
    if (!localStorage.getItem('usuariosRegistrados')) {
      localStorage.setItem('usuariosRegistrados', JSON.stringify(this.usuariosPredefinidos));
    }
  }

async iniciarSesion() {
  const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
  
  // Buscar al usuario por nombre y contraseña
  const usuarioEncontrado = usuariosGuardados.find((u: any) => 
    u.usuario === this.usuario && u.contrasenia === this.contrasenia
  );

  if (usuarioEncontrado) {
    const alert = await this.alertctrl.create({
      header: 'Acceso permitido',
      message: 'Inicio de sesión exitoso.',
      buttons: [{
        text: 'OK',
        handler: () => {
          // Guardar en sesión
          localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
          
          // Redirección
          this.router.navigate(['/inicio']);
        }
      }]
    });
    await alert.present();
  } else {
    const alert = await this.alertctrl.create({
      header: 'Error',
      message: 'Nombre o contraseña incorrectos.',
      buttons: ['Intentar de nuevo'],
    }); 
    await alert.present();
  }
}

  // Método para agregar o actualizar usuarios (puedes llamarlo desde otras páginas)
  actualizarUsuario(nuevoUsuario: string, nuevaContrasenia: string) {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
    
    // Buscar si el usuario ya existe
    const usuarioIndex = usuariosGuardados.findIndex((u: any) => u.usuario === nuevoUsuario);
    
    if (usuarioIndex !== -1) {
      // Actualizar contraseña si el usuario existe
      usuariosGuardados[usuarioIndex].contrasenia = nuevaContrasenia;
    } else {
      // Agregar nuevo usuario
      usuariosGuardados.push({
        usuario: nuevoUsuario,
        contrasenia: nuevaContrasenia
      });
    }
    
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosGuardados));
  }

  

  // Método para restablecer usuarios predefinidos
  restablecerUsuariosPredefinidos() {
    localStorage.setItem('usuariosRegistrados', JSON.stringify(this.usuariosPredefinidos));
  }
}