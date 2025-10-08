import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { 
  ApiService, 
  CurrencyQueryLogResponseDto, 
  CurrencyRequestDto, 
  CurrencyResponseDto,
  PageResponse,
  ErrorResponse
} from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, AsyncPipe, DatePipe, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('xcode_task');

  currency = signal<string>('EUR');
  name = signal<string>('Jan Nowak');
  loading = signal<boolean>(false);
  loadingRequests = signal<boolean>(false);
  error = signal<string | null>(null);
  validationErrors = signal<Array<{ field: string; message: string }> | null>(null);
  result = signal<CurrencyResponseDto | null>(null);
  requests = signal<CurrencyQueryLogResponseDto[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  submit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.error.set(null);
    this.validationErrors.set(null);
    this.loading.set(true);
    
    const payload: CurrencyRequestDto = { 
      currency: this.currency().toUpperCase().trim(), 
      name: this.name().trim() 
    };

    this.api.getCurrentValue(payload).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
        this.loadRequests();
      },
      error: (err) => {
        const errorResponse: ErrorResponse = err?.error;
        this.error.set(errorResponse?.message || errorResponse?.error || 'Wystąpił błąd podczas pobierania kursu');
        this.validationErrors.set(errorResponse?.validationErrors || null);
        this.loading.set(false);
      }
    });
  }

  loadRequests(page: number = 0): void {
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

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadRequests(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.loadRequests(this.currentPage() - 1);
    }
  }
}
