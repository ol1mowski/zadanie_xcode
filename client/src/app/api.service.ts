import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080';

  getCurrentValue(body: CurrencyRequestDto): Observable<CurrencyResponseDto> {
    return this.http.post<CurrencyResponseDto>(`${this.baseUrl}/currencies/get-current-currency-value-command`, body);
  }

  getRequests(): Observable<CurrencyQueryLogResponseDto[]> {
    return this.http.get<CurrencyQueryLogResponseDto[]>(`${this.baseUrl}/currencies/requests`);
  }
}


