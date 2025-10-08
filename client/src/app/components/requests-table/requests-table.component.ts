import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CurrencyQueryLogResponseDto } from '../../models/currency.models';

@Component({
  selector: 'app-requests-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './requests-table.component.html',
  styleUrl: './requests-table.component.css'
})
export class RequestsTableComponent {
  requests = input<CurrencyQueryLogResponseDto[]>([]);
  loading = input<boolean>(false);
  currentPage = input<number>(0);
  totalPages = input<number>(0);
  totalElements = input<number>(0);

  pageChange = output<number>();

  onPreviousPage(): void {
    if (this.currentPage() > 0) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  onNextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}
