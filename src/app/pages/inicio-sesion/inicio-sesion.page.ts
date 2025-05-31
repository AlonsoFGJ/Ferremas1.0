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
  correo: string = '';
  usuario_aut: string = '';
  // Usuarios predefinidos
  private usuariosPredefinidos = [
    { usuario: 'admin', correo: 'admin@gmail.com', contrasenia: 'admin123' },
    { usuario: 'vendedor', correo: 'vendedor@gmail.com', contrasenia: 'vendedor123' },
    { usuario: 'contador', correo: 'contador@gmail.com', contrasenia: 'contador123' },
    { usuario: 'bodega', correo: 'bodega@gmail.com', contrasenia: 'bodega1234' },
    { usuario: 'invitado', correo: 'invitado@gmail.com', contrasenia: 'invitado123' }
  ];

  constructor(private router: Router, private alertctrl: AlertController) { }

  IraCambiarContrasenna() {
    this.router.navigate(['/cambiar-contrasenna'])
  }

  IraCrearCuenta() {
    this.router.navigate(['/crear-cuenta'])
  }

  ngOnInit() {
  // Eliminamos siempre 'usuarioActual', independiente de si existe o no
  localStorage.removeItem('usuarioActual');

  // Cargar los usuarios predefinidos solo si 'usuariosRegistrados' NO existe
  const usuariosGuardados = localStorage.getItem('usuariosRegistrados');

  if (!usuariosGuardados) {
    // Si no hay usuarios registrados, cargamos los predefinidos
    localStorage.setItem('usuariosRegistrados', JSON.stringify(this.usuariosPredefinidos));
    console.log('Usuarios predefinidos cargados por primera vez.');
  } else {
    console.log('Ya existen usuarios registrados. No se modifican.');
  }
}

async iniciarSesion() {
  const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');

  
  // Buscar al usuario por correo y contraseña
  const usuarioEncontrado = usuariosGuardados.find((u: any) => 
    u.correo === this.correo && u.contrasenia === this.contrasenia
  );

  if (usuarioEncontrado) {
  // Asignar el usuario encontrado a una variable para usarlo luego
  this.usuario_aut = usuarioEncontrado.usuario; // <-- Esto puedes usar si necesitas guardarlo como propiedad

  const alert = await this.alertctrl.create({
    header: 'Acceso permitido',
    message: 'Inicio de sesión exitoso.',
    buttons: [{
      text: 'OK',
      handler: () => {
        // Guardar en localStorage (sesión)
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));

        // Usamos directamente el usuario encontrado para la redirección
        if (usuarioEncontrado.usuario === 'vendedor') {
          this.router.navigate(['/inicio-vendedor']);
        } else if (usuarioEncontrado.usuario === 'bodega') {
          this.router.navigate(['/inicio-bodeguero']);
        } else if (usuarioEncontrado.usuario === 'contador') {
          this.router.navigate(['/inicio-contadorro']); // Revisa la ruta, parece haber un typo en tu código original
        } else {
          this.router.navigate(['/inicio']);
        }
      }
    }]
  });
  await alert.present();
    }
  }
}