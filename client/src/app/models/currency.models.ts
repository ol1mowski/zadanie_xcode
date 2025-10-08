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
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}
