import { Component, input } from '@angular/core';
import { CurrencyResponseDto } from '../../models/currency.models';

@Component({
  selector: 'app-currency-result',
  standalone: true,
  imports: [],
  templateUrl: './currency-result.component.html',
  styleUrl: './currency-result.component.css'
})
export class CurrencyResultComponent {
  result = input<CurrencyResponseDto | null>(null);
  currencyCode = input<string>('');
}
