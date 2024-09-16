import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [authGuard], // Podría implementarse con autentificación de usuario, contraseña y ids
  },
  {
    path: '**',
    redirectTo: '',
  },
];
