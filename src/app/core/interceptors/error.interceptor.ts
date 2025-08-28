import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => next(req).pipe(
  // Aquí podrías mapear errores y mostrar toasts globales
);
