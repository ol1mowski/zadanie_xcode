import { Component, output, signal, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CurrencyRequestDto } from '../../models/currency.models';

@Component({
  selector: 'app-currency-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './currency-form.component.html',
  styleUrl: './currency-form.component.css'
})
export class CurrencyFormComponent {
  loading = input<boolean>(false);
  
  submitForm = output<CurrencyRequestDto>();

  currency = signal<string>('EUR');
  name = signal<string>('Jan Nowak');

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const request: CurrencyRequestDto = {
      currency: this.currency().toUpperCase().trim(),
      name: this.name().trim()
    };

    this.submitForm.emit(request);
  }
}
