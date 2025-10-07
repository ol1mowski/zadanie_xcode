import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { ApiService, CurrencyQueryLogResponseDto, CurrencyRequestDto, CurrencyResponseDto } from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, AsyncPipe, DatePipe, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('xcode_task');

  currency = signal<string>('EUR');
  name = signal<string>('Jan Nowak');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<CurrencyResponseDto | null>(null);
  requests = signal<CurrencyQueryLogResponseDto[] | null>(null);

  constructor(private readonly api: ApiService) {}

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    const payload: CurrencyRequestDto = { currency: this.currency(), name: this.name() };
    this.api.getCurrentValue(payload).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
        this.loadRequests();
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Błąd');
        this.loading.set(false);
      }
    });
  }

  loadRequests(): void {
    this.api.getRequests().subscribe({
      next: (list) => this.requests.set(list),
      error: () => this.requests.set([])
    });
  }

  ngOnInit(): void {
    this.loadRequests();
  }
}
