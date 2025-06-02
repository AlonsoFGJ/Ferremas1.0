import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiusuarioService } from 'src/app/services/apiusuario.service';
import { ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cambiar-contrasenna',
  templateUrl: './cambiar-contrasenna.page.html',
  styleUrls: ['./cambiar-contrasenna.page.scss'],
  standalone: false
})
export class CambiarContrasennaPage {
  usuarioEncontrado: any = null;
  mostrarMensaje: boolean = false;
  mensajeToast: string = '';

  contrasenaForm: FormGroup;

  constructor(
    private router: Router,
    private apiUsuarioService: ApiusuarioService,
    private toastController: ToastController,
    private alertController: AlertController,
    private fb: FormBuilder
  ) {
    this.contrasenaForm = this.fb.group({
      rut: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}-[0-9kK]{1}$/)]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('nuevaContrasena')?.value;
    const confirmPassword = form.get('confirmarContrasena')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmarContrasena')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmarContrasena')?.setErrors(null);
    }
  }

  buscarUsuario() {
    if (this.contrasenaForm.get('rut')?.invalid) {
      this.mostrarToast('Por favor ingrese un RUT válido');
      return;
    }

    const rut = this.contrasenaForm.get('rut')?.value;

    this.apiUsuarioService.obtenerUsuario(rut).subscribe({
      next: (usuario) => {
        this.usuarioEncontrado = usuario;
        this.mostrarToast('Usuario encontrado');
      },
      error: (error) => {
        this.usuarioEncontrado = null;
        this.mostrarToast('Usuario no encontrado');
        console.error('Error al buscar usuario:', error);
      }
    });
  }

  cambiarContrasena() {
    if (!this.usuarioEncontrado) {
      this.mostrarToast('Primero busque un usuario válido');
      return;
    }

    if (this.contrasenaForm.invalid) {
      this.mostrarToast('Por favor complete correctamente el formulario');
      return;
    }

    const rut = this.contrasenaForm.get('rut')?.value;
    const nuevaContrasena = this.contrasenaForm.get('nuevaContrasena')?.value;

    const datosActualizacion = {
      contra: nuevaContrasena
    };

    this.apiUsuarioService.actualizarParcial(rut, datosActualizacion).subscribe({
      next: () => {
        this.mostrarAlerta('Contraseña cambiada exitosamente');
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al cambiar contraseña:', error);
        this.mostrarAlerta('Error al cambiar la contraseña');
      }
    });
  }

  limpiarFormulario() {
    this.usuarioEncontrado = null;
    this.contrasenaForm.reset();
  }

  async mostrarToast(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarMensaje = true;
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: mensaje.includes('éxito') ? 'Éxito' : 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  setOpen(estado: boolean) {
    this.mostrarMensaje = estado;
  }

  irAInicio() {
    this.router.navigate(['/iniciosin']);
  }
}