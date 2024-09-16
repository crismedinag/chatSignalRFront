import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ChatStoreService } from '../services/state/chat-store.service';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
  const router = inject(Router);
  const chatStoreService = inject(ChatStoreService);

  //  if (user) {
  //    return true;
  //  } else {
  //    // Redirigir al usuario si no está autenticado
  //    router.navigate(['/']);
  //    return false;
  //  }
};
