import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestsTableComponent } from './requests-table.component';
import { DatePipe } from '@angular/common';

describe('RequestsTableComponent', () => {
  let component: RequestsTableComponent;
  let fixture: ComponentFixture<RequestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsTableComponent, DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading message when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-box')).toBeTruthy();
    expect(compiled.textContent).toContain('Ładowanie historii');
  });

  it('should display empty state when no requests', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('requests', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
    expect(compiled.textContent).toContain('Brak zapisanych zapytań');
  });

  it('should display table with requests', () => {
    const mockRequests = [
      { currency: 'EUR', name: 'Jan Nowak', date: '2024-01-01T10:00:00Z', value: 4.25 },
      { currency: 'USD', name: 'Anna Kowalska', date: '2024-01-02T11:00:00Z', value: 3.99 }
    ];

    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('requests', mockRequests);
    fixture.componentRef.setInput('totalElements', 2);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('table')).toBeTruthy();
    expect(compiled.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('should display total elements count', () => {
    fixture.componentRef.setInput('requests', []);
    fixture.componentRef.setInput('totalElements', 42);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('42 zapytań');
  });

  it('should display pagination when multiple pages', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('requests', [
      { currency: 'EUR', name: 'Test', date: '2024-01-01', value: 4.25 }
    ]);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.pagination')).toBeTruthy();
    expect(compiled.textContent).toContain('Strona 2 z 5');
  });

  it('should not display pagination when single page', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('requests', [
      { currency: 'EUR', name: 'Test', date: '2024-01-01', value: 4.25 }
    ]);
    fixture.componentRef.setInput('totalPages', 1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.pagination')).toBeFalsy();
  });

  it('should emit pageChange on next page', () => {
    let emittedPage: number | undefined;
    component.pageChange.subscribe((page) => {
      emittedPage = page;
    });

    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 5);

    component.onNextPage();

    expect(emittedPage).toBe(2);
  });

  it('should emit pageChange on previous page', () => {
    let emittedPage: number | undefined;
    component.pageChange.subscribe((page) => {
      emittedPage = page;
    });

    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 5);

    component.onPreviousPage();

    expect(emittedPage).toBe(1);
  });

  it('should not emit pageChange when on first page and clicking previous', () => {
    let emitted = false;
    component.pageChange.subscribe(() => {
      emitted = true;
    });

    fixture.componentRef.setInput('currentPage', 0);

    component.onPreviousPage();

    expect(emitted).toBe(false);
  });

  it('should not emit pageChange when on last page and clicking next', () => {
    let emitted = false;
    component.pageChange.subscribe(() => {
      emitted = true;
    });

    fixture.componentRef.setInput('currentPage', 4);
    fixture.componentRef.setInput('totalPages', 5);

    component.onNextPage();

    expect(emitted).toBe(false);
  });

  it('should disable previous button on first page', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('requests', [
      { currency: 'EUR', name: 'Test', date: '2024-01-01', value: 4.25 }
    ]);
    fixture.componentRef.setInput('currentPage', 0);
    fixture.componentRef.setInput('totalPages', 3);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.pagination-btn');
    expect(buttons[0].disabled).toBe(true);
  });

  it('should disable next button on last page', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('requests', [
      { currency: 'EUR', name: 'Test', date: '2024-01-01', value: 4.25 }
    ]);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 3);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.pagination-btn');
    expect(buttons[1].disabled).toBe(true);
  });
});
