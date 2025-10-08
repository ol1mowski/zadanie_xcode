import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService, CurrencyRequestDto, CurrencyResponseDto, PageResponse, CurrencyQueryLogResponseDto } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentValue', () => {
    it('should post currency request and return response', () => {
      const mockRequest: CurrencyRequestDto = {
        currency: 'EUR',
        name: 'Jan Nowak'
      };
      const mockResponse: CurrencyResponseDto = {
        value: 4.25
      };

      service.getCurrentValue(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.value).toBe(4.25);
      });

      const req = httpMock.expectOne(`${baseUrl}/currencies/get-current-currency-value-command`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      const mockRequest: CurrencyRequestDto = {
        currency: 'XXX',
        name: 'Jan Nowak'
      };

      service.getCurrentValue(mockRequest).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/currencies/get-current-currency-value-command`);
      req.flush({ error: 'Currency not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getRequests', () => {
    it('should get paginated requests with default parameters', () => {
      const mockResponse: PageResponse<CurrencyQueryLogResponseDto> = {
        content: [
          { currency: 'EUR', name: 'Jan Nowak', date: '2024-01-01T10:00:00Z', value: 4.25 }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 20,
        number: 0,
        first: true,
        last: true
      };

      service.getRequests().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.content.length).toBe(1);
        expect(response.totalElements).toBe(1);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${baseUrl}/currencies/requests` && 
        req.params.get('page') === '0' &&
        req.params.get('size') === '20' &&
        req.params.get('sort') === 'createdAt,desc'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get paginated requests with custom parameters', () => {
      const mockResponse: PageResponse<CurrencyQueryLogResponseDto> = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 2,
        first: false,
        last: true
      };

      service.getRequests(2, 10).subscribe(response => {
        expect(response.number).toBe(2);
        expect(response.size).toBe(10);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${baseUrl}/currencies/requests` && 
        req.params.get('page') === '2' &&
        req.params.get('size') === '10'
      );
      req.flush(mockResponse);
    });
  });
});
