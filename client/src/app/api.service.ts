import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  CurrencyRequestDto,
  CurrencyResponseDto,
  CurrencyQueryLogResponseDto,
  PageResponse
} from './models/currency.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCurrentValue(body: CurrencyRequestDto): Observable<CurrencyResponseDto> {
    return this.http.post<CurrencyResponseDto>(
      `${this.baseUrl}/currencies/get-current-currency-value-command`, 
      body
    );
  }

  getRequests(page: number = 0, size: number = 20): Observable<PageResponse<CurrencyQueryLogResponseDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');
    
    return this.http.get<PageResponse<CurrencyQueryLogResponseDto>>(
      `${this.baseUrl}/currencies/requests`,
      { params }
    );
  }
}


