import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NcrChartItem, NcrColumnsResponse, NcrRequest, NcrTabularItem } from './NCRData';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NcrService {

  constructor(private http : HttpClient) 
  { }

  getNcrColumns(): Observable<NcrColumnsResponse> {
    return this.http.get<NcrColumnsResponse>('/api/ncrColumns');
  }

  getChartData(payload: NcrRequest): Observable<NcrChartItem[]> {
    return this.http.post<{ chart: NcrChartItem[] }>('/api/ncrChart', payload)
      .pipe(map(res => res.chart));
  }

  getTabularData(payload: NcrRequest): Observable<NcrTabularItem[]> {
    return this.http.post<{ activities: NcrTabularItem[] }>('/api/ncrTabular', payload)
      .pipe(map(res => res.activities));
  }
}
