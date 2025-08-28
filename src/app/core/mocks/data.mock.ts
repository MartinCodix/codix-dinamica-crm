import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataMock {
  getSeries() {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const quotes = months.map((m) => Math.round(20 + Math.random() * 30));
    const orders = months.map((m) => Math.round(10 + Math.random() * 20));
    return of({
      labels: months.map((m) =>
        new Date(2025, m - 1, 1).toLocaleString('es-MX', { month: 'short' })
      ),
      quotes,
      orders,
    }).pipe(delay(700));
  }
}
