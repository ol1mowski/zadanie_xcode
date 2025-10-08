import { Component, signal, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { 
  CurrencyQueryLogResponseDto, 
  CurrencyRequestDto, 
  CurrencyResponseDto,
  PageResponse,
  ErrorResponse,
  ValidationError
} from './models/currency.models';
import { CurrencyFormComponent } from './components/currency-form/currency-form.component';
import { CurrencyResultComponent } from './components/currency-result/currency-result.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { RequestsTableComponent } from './components/requests-table/requests-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CurrencyFormComponent,
    CurrencyResultComponent,
    ErrorMessageComponent,
    RequestsTableComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  validationErrors = signal<ValidationError[] | null>(null);
  result = signal<CurrencyResponseDto | null>(null);
  currentCurrency = signal<string>('');

  loadingRequests = signal<boolean>(false);
  requests = signal<CurrencyQueryLogResponseDto[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  onSubmit(request: CurrencyRequestDto): void {
    this.error.set(null);
    this.validationErrors.set(null);
    this.loading.set(true);
    this.currentCurrency.set(request.currency);

    this.api.getCurrentValue(request).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
        this.loadRequests();
      },
      error: (err) => {
        const errorResponse: ErrorResponse = err?.error;
        this.error.set(
          errorResponse?.message || 
          errorResponse?.error || 
          'Wystąpił błąd podczas pobierania kursu'
        );
        this.validationErrors.set(errorResponse?.validationErrors || null);
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number): void {
    this.loadRequests(page);
  }

  private loadRequests(page: number = 0): void {
    this.loadingRequests.set(true);
    
    this.api.getRequests(page, 20).subscribe({
      next: (response: PageResponse<CurrencyQueryLogResponseDto>) => {
        this.requests.set(response.content);
        this.currentPage.set(response.number);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.loadingRequests.set(false);
      },
      error: (err) => {
        console.error('Failed to load requests:', err);
        this.requests.set([]);
        this.loadingRequests.set(false);
      }
    });
  }
}
