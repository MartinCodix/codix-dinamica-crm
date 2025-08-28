import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ResponseType } from '../types/response.type';
import { data as kpis } from '../mocks/kpis.mock';
import { KPIType } from '../types/kpi.type';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getKPIs(): Observable<ResponseType<KPIType[]>> {
    const response: ResponseType<KPIType[]> = {
      data: kpis as unknown as KPIType[],
      status: 'success',
    };
    return of(response).pipe(delay(500));
  }
}
