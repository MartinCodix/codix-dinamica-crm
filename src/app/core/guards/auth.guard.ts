import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../stores/auth.store';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = inject(AuthStore).user();
  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
