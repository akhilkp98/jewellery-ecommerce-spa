import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If NOT authenticated, allow them to view the guest (login) pages
  if (!authService.isAuthenticated()) {
    return true;
  }

  // If already logged in, redirect them back to the dashboard immediately
  return router.createUrlTree(['/home']);
};
