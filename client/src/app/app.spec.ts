import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app';
import { ApiService } from './api.service';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getCurrentValue', 'getRequests']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule],
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
    expect(component.currency()).toBe('EUR');
    expect(component.name()).toBe('Jan Nowak');
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.result()).toBeNull();
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

  it('should submit form and get currency value', (done) => {
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

    const mockForm = { valid: true } as any;
    component.currency.set('USD');
    component.name.set('John Doe');

    component.submit(mockForm);

    setTimeout(() => {
      expect(apiService.getCurrentValue).toHaveBeenCalledWith({
        currency: 'USD',
        name: 'John Doe'
      });
      expect(component.result()).toEqual(mockResponse);
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
      done();
    }, 100);
  });

  it('should not submit invalid form', () => {
    const mockForm = { valid: false } as any;
    
    component.submit(mockForm);

    expect(apiService.getCurrentValue).not.toHaveBeenCalled();
  });

  it('should handle error on submit', (done) => {
    const mockError = {
      error: {
        error: 'Currency Not Found',
        message: 'Currency not found: XXX',
        status: 404
      }
    };
    
    apiService.getCurrentValue.and.returnValue(throwError(() => mockError));

    const mockForm = { valid: true } as any;
    component.currency.set('XXX');
    component.name.set('John Doe');

    component.submit(mockForm);

    setTimeout(() => {
      expect(component.error()).toBe('Currency not found: XXX');
      expect(component.loading()).toBe(false);
      expect(component.result()).toBeNull();
      done();
    }, 100);
  });

  it('should handle validation errors', (done) => {
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

    const mockForm = { valid: true } as any;
    component.submit(mockForm);

    setTimeout(() => {
      expect(component.validationErrors()).toBeTruthy();
      expect(component.validationErrors()!.length).toBe(1);
      done();
    }, 100);
  });

  it('should navigate to next page', () => {
    const mockResponse = {
      content: [],
      totalElements: 100,
      totalPages: 5,
      size: 20,
      number: 1,
      first: false,
      last: false
    };
    
    apiService.getRequests.and.returnValue(of(mockResponse));
    component.currentPage.set(0);
    component.totalPages.set(5);

    component.nextPage();

    expect(apiService.getRequests).toHaveBeenCalledWith(1, 20);
  });

  it('should navigate to previous page', () => {
    const mockResponse = {
      content: [],
      totalElements: 100,
      totalPages: 5,
      size: 20,
      number: 0,
      first: true,
      last: false
    };
    
    apiService.getRequests.and.returnValue(of(mockResponse));
    component.currentPage.set(1);

    component.previousPage();

    expect(apiService.getRequests).toHaveBeenCalledWith(0, 20);
  });

  it('should not go to previous page when on first page', () => {
    component.currentPage.set(0);
    apiService.getRequests.calls.reset();

    component.previousPage();

    expect(apiService.getRequests).not.toHaveBeenCalled();
  });

  it('should not go to next page when on last page', () => {
    component.currentPage.set(4);
    component.totalPages.set(5);
    apiService.getRequests.calls.reset();

    component.nextPage();

    expect(apiService.getRequests).not.toHaveBeenCalled();
  });

  it('should trim and uppercase currency code', (done) => {
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

    const mockForm = { valid: true } as any;
    component.currency.set(' eur ');
    component.name.set(' John Doe ');

    component.submit(mockForm);

    setTimeout(() => {
      expect(apiService.getCurrentValue).toHaveBeenCalledWith({
        currency: 'EUR',
        name: 'John Doe'
      });
      done();
    }, 100);
  });
});