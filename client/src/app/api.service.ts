import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface CurrencyRequestDto {
  currency: string;
  name: string;
}

export interface CurrencyResponseDto {
  value: number;
}

export interface CurrencyQueryLogResponseDto {
  currency: string;
  name: string;
  date: string; 
  value: number | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  validationErrors?: Array<{ field: string; message: string }>;
}

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


