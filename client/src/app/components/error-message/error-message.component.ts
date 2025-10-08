import { Component, input } from '@angular/core';
import { ValidationError } from '../../models/currency.models';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  error = input<string | null>(null);
  validationErrors = input<ValidationError[] | null>(null);
}
