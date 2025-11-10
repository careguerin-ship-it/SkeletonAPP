import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  // no standalone, para ser compatible con el módulo típico de Ionic
  standalone: false,
  animations: [
    // animación izquierda -> derecha para nombre y apellido (1s, una iteración)
    trigger('inputSlide', [
      state('', style({ transform: 'translateX(0)' })),
      state('slide', style({ transform: 'translateX(0)' })),
      transition('* => slide', [
        style({ transform: 'translateX(-100%)' }),
        animate('1000ms ease-out')
      ])
    ])
  ]
})
export class HomePage {
  // usuario recibido desde Login (history.state es la forma robusta para recargas)
  user: string = 'Invitado';

  // campos requeridos por la actividad
  firstName: string = '';
  lastName: string = '';
  education: string = '';
  birthDate: Date | null = null;

  // control para activar la animación en los ion-item
  inputAnimState: '' | 'slide' = '';

  constructor(private toastCtrl: ToastController) {
    // recuperar user pasado desde el Login (history.state funciona aun tras recarga)
    const nav = history.state as any;
    if (nav?.user) {
      // si pasaste un objeto { username: 'caro' } o solo 'caro'
      this.user = typeof nav.user === 'object' ? (nav.user.username ?? nav.user) : nav.user;
    }
  }

  // muestra nombre y apellido en un mensaje emergente (toast)
  async onShow() {
    const name = this.firstName?.trim() || '[Sin nombre]';
    const last = this.lastName?.trim() || '[Sin apellido]';
    const toast = await this.toastCtrl.create({
      message: `Nombre: ${name}\nApellido: ${last}`,
      duration: 2500,
      position: 'top'
    });
    await toast.present();
  }

  // limpia todos los campos y activa la animación una sola vez (1s)
  onClear() {
    this.firstName = '';
    this.lastName = '';
    this.education = '';
    this.birthDate = null;

    // activar animación L->R
    this.inputAnimState = 'slide';
    // resetear para permitir futuras ejecuciones
    setTimeout(() => (this.inputAnimState = ''), 1000);
  }
}
