import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app';
import { ApiService } from './api.service';
import { of, throwError } from 'rxjs';
import { CurrencyRequestDto } from './models/currency.models';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getCurrentValue', 'getRequests']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.result()).toBeNull();
    expect(component.loadingRequests()).toBe(false);
    expect(component.requests()).toEqual([]);
  });

  it('should load requests on init', () => {
    const mockResponse = {
      content: [{ currency: 'EUR', name: 'Test', date: '2024-01-01', value: 4.25 }],
      totalElements: 1,
      totalPages: 1,
      size: 20,
      number: 0,
      first: true,
      last: true
    };
    apiService.getRequests.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(apiService.getRequests).toHaveBeenCalledWith(0, 20);
    expect(component.requests().length).toBe(1);
    expect(component.totalElements()).toBe(1);
  });

  it('should handle form submission', (done) => {
    const mockRequest: CurrencyRequestDto = {
      currency: 'USD',
      name: 'John Doe'
    };
    const mockResponse = { value: 4.25 };
    const mockPageResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 20,
      number: 0,
      first: true,
      last: true
    };
    
    apiService.getCurrentValue.and.returnValue(of(mockResponse));
    apiService.getRequests.and.returnValue(of(mockPageResponse));

    component.onSubmit(mockRequest);

    setTimeout(() => {
      expect(apiService.getCurrentValue).toHaveBeenCalledWith(mockRequest);
      expect(component.result()).toEqual(mockResponse);
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
      expect(component.currentCurrency()).toBe('USD');
      done();
    }, 100);
  });

  it('should handle error on submit', (done) => {
    const mockRequest: CurrencyRequestDto = {
      currency: 'XXX',
      name: 'John Doe'
    };
    const mockError = {
      error: {
        error: 'Currency Not Found',
        message: 'Currency not found: XXX',
        status: 404
      }
    };
    
    apiService.getCurrentValue.and.returnValue(throwError(() => mockError));

    component.onSubmit(mockRequest);

    setTimeout(() => {
      expect(component.error()).toBe('Currency not found: XXX');
      expect(component.loading()).toBe(false);
      done();
    }, 100);
  });

  it('should handle validation errors', (done) => {
    const mockRequest: CurrencyRequestDto = {
      currency: 'E',
      name: 'Test'
    };
    const mockError = {
      error: {
        error: 'Validation Failed',
        message: 'Request validation failed',
        status: 400,
        validationErrors: [
          { field: 'currency', message: 'Currency code must be exactly 3 characters' }
        ]
      }
    };
    
    apiService.getCurrentValue.and.returnValue(throwError(() => mockError));

    component.onSubmit(mockRequest);

    setTimeout(() => {
      expect(component.validationErrors()).toBeTruthy();
      expect(component.validationErrors()!.length).toBe(1);
      done();
    }, 100);
  });

  it('should handle page change', () => {
    const mockResponse = {
      content: [],
      totalElements: 100,
      totalPages: 5,
      size: 20,
      number: 2,
      first: false,
      last: false
    };
    
    apiService.getRequests.and.returnValue(of(mockResponse));

    component.onPageChange(2);

    expect(apiService.getRequests).toHaveBeenCalledWith(2, 20);
  });

  it('should update page state after loading requests', (done) => {
    const mockResponse = {
      content: [
        { currency: 'EUR', name: 'Test', date: '2024-01-01', value: 4.25 }
      ],
      totalElements: 50,
      totalPages: 3,
      size: 20,
      number: 1,
      first: false,
      last: false
    };
    
    apiService.getRequests.and.returnValue(of(mockResponse));

    component.onPageChange(1);

    setTimeout(() => {
      expect(component.requests().length).toBe(1);
      expect(component.currentPage()).toBe(1);
      expect(component.totalPages()).toBe(3);
      expect(component.totalElements()).toBe(50);
      expect(component.loadingRequests()).toBe(false);
      done();
    }, 100);
  });
});