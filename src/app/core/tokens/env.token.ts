import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment.development';
export const ENV = new InjectionToken('ENV', {
  providedIn: 'root',
  factory: () => environment,
});
