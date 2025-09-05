import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ENV } from '../tokens/env.token';

@Injectable({ providedIn: 'root' })
export class BanxicoService {
  private http = inject(HttpClient);
  private env = inject(ENV) as any;

  token = this.env?.banxicoToken
  url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=${encodeURIComponent(
    this.token
  )}`;
  get = (): Observable<number | null> => {
    if (!this.token) {
      console.warn('[CurrencyService] Falta banxicoToken en environment');
      return of(null);
    }
    return this.http
      .get(this.url, {
        responseType: 'text',
        headers: { Accept: 'application/xml' },
      })
      .pipe(
        map((xml) => this.parse(xml)),
        catchError((err) => {
          console.error(
            '[CurrencyService] Error al obtener tipo de cambio',
            err
          );
          return of(null);
        })
      );
  };

  parse = (xml: string): number | null => {
    try {
      const match = xml.match(/<dato>(.*?)<\/dato>/i);
      if (!match) return null;
      const value = parseFloat(match[1].trim());
      return isNaN(value) ? null : value;
    } catch {
      return null;
    }
  };
}
