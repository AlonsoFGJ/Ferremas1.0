import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiusuarioService } from 'src/app/services/apiusuario.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
  standalone: false
})
export class AdministrarPage implements OnInit {
  nombreUsuario: string = '';
  isModalOpen = false;
  isEditing = false;
  currentUserId: string | null = null;
  searchTerm = '';
  
  // Datos de ejemplo - en una aplicación real estos vendrían de una API

  
  users: any[] = []; // Solo declaramos la variable
  filteredUsers: any[] = [];
  
  userForm: FormGroup;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private usuarioService: ApiusuarioService
  ) {
    this.userForm = this.fb.group({
      tipo_usuario: ['', Validators.required],
      p_nombre: ['', Validators.required],
      s_nombre: [''],
      p_apellido: ['', Validators.required],
      s_apellido: [''],
      rut: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      contra: ['', Validators.minLength(6)],
      contra2: ['', Validators.minLength(6)]
    }, { validators: this.passwordMatchValidator });
  }

  cargarUsuariosDesdeAPI() {
  this.usuarioService.obtenerUsuarios().subscribe(
    (res: any[]) => {
      console.log('Usuarios obtenidos desde API:', res);
      this.users = res;
      this.filteredUsers = [...this.users]; // Para que el filtro funcione
    },
    error => {
      console.error('Error al obtener usuarios desde API', error);
      this.mostrarAlerta('No se pudieron cargar los usuarios.');
    }
  );
}

async mostrarAlerta(mensaje: string) {
  const alert = await this.alertCtrl.create({
    header: 'Error',
    message: mensaje,
    buttons: ['OK']
  });
  await alert.present();
}

  

  ngOnInit() {
  const usuarioActual = localStorage.getItem('usuarioActual');
  if (!usuarioActual) {
    this.router.navigate(['/iniciosin']);
    return;
  }

  const user = JSON.parse(usuarioActual);
  this.nombreUsuario = user.p_nombre || user.usuario;

  this.cargarUsuariosDesdeAPI(); // <--- Aquí llamas la carga real desde la API
}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contra')?.value;
    const confirmPassword = form.get('contra2')?.value;
    
    if (password !== confirmPassword) {
      form.get('contra2')?.setErrors({ mismatch: true });
    } else {
      form.get('contra2')?.setErrors(null);
    }
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.p_nombre.toLowerCase().includes(term) ||
      user.p_apellido.toLowerCase().includes(term) ||
      user.rut.toLowerCase().includes(term) ||
      user.correo.toLowerCase().includes(term) ||
      user.tipo_usuario.toLowerCase().includes(term)
    );
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentUserId = null;
    this.userForm.reset();
    // No requerir contraseña para edición
    this.userForm.get('rut')?.enable(); // <-- esto es importante
    this.userForm.get('contra')?.clearValidators();
    this.userForm.get('contra2')?.clearValidators();
    this.userForm.get('contra')?.updateValueAndValidity();
    this.userForm.get('contra2')?.updateValueAndValidity();
    this.setOpen(true);
  }

  openEditModal(user: any) {
    this.isEditing = true;
    this.currentUserId = user.rut;
    
    
    // Rellenar el formulario con los datos del usuario
    this.userForm.patchValue({
      tipo_usuario: user.tipo_usuario,
      p_nombre: user.p_nombre,
      s_nombre: user.s_nombre,
      p_apellido: user.p_apellido,
      s_apellido: user.s_apellido,
      rut: user.rut,
      correo: user.correo,
      direccion: user.direccion
    });
    
    // No requerir contraseña para edición    
    this.userForm.get('rut')?.disable(); // <-- esto es importante
    this.userForm.get('contra')?.clearValidators();
    this.userForm.get('contra2')?.clearValidators();
    this.userForm.get('contra')?.updateValueAndValidity();
    this.userForm.get('contra2')?.updateValueAndValidity();
    
    this.setOpen(true);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) {
      this.userForm.reset();
    }
  }

  async handleSubmit() {
  if (this.userForm.invalid) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'Por favor complete todos los campos requeridos correctamente.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  const formValues = { ...this.userForm.getRawValue() };

  if (this.isEditing == true && this.currentUserId) {
    // 🔁 Modo edición
    const rutUsuario = formValues.rut;

    this.usuarioService.actualizarParcial(rutUsuario, formValues).subscribe(
      async () => {
        await this.mostrarAlerta('Usuario actualizado correctamente');
        this.setOpen(false);
        this.cargarUsuariosDesdeAPI();
      },
      async (error) => {
        console.error('Error al actualizar usuario', error);
        await this.mostrarAlerta('No se pudo actualizar el usuario.');
      }
    );
  } else if (this.isEditing == false) {
    // ✨ Modo creación
    this.usuarioService.agregarUsuario(formValues).subscribe(
      async () => {
        await this.mostrarAlerta('Usuario creado correctamente');
        this.setOpen(false);
        this.cargarUsuariosDesdeAPI();
      },
      async (error) => {
        console.error('Error al crear usuario', error);
        await this.mostrarAlerta('No se pudo crear el usuario.');
      }
    );
  }
}

  async confirmDelete(user: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Estás seguro de que deseas eliminar a ${user.p_nombre} ${user.p_apellido}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteUser(user);
          }
        }
      ]
      
    });
    
    await alert.present();
  }

  deleteUser(user: any) {
  this.usuarioService.eliminarUsuario(user.rut).subscribe(
    async () => {
      await this.mostrarAlerta('Usuario eliminado correctamente.');
      this.cargarUsuariosDesdeAPI();
    },
    async (error) => {
      console.error('Error al eliminar usuario', error);
      await this.mostrarAlerta('No se pudo eliminar el usuario.');
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
}