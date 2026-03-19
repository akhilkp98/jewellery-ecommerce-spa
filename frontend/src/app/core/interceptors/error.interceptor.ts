import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (typeof window !== 'undefined') {
        if (error.status === 0) {
          toastr.error('Network error. Please check your connection.', 'Error');
        } else {
          switch (error.status) {
            case 400:
              toastr.warning(error.error?.message || error.error?.error || 'Bad Request', 'Warning');
              break;
            case 401:
              if (error.error?.message === 'Invalid credentials') {
                toastr.error('Invalid login credentials.', 'Authentication Failed');
              } else {
                toastr.error('Your session has expired. Please log in again.', 'Session Expired');
              }
              authService.logout();
              break;
            case 403:
              toastr.error('Access Denied', 'Forbidden');
              break;
            case 404:
              toastr.info('Resource not found', 'Not Found');
              break;
            case 500:
              toastr.error('Server error. Please try again later', 'System Error');
              break;
            default:
              toastr.error('Something went wrong', 'Error');
          }
        }
      }
      return throwError(() => error);
    })
  );
};
