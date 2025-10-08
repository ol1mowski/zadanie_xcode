import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyResultComponent } from './currency-result.component';

describe('CurrencyResultComponent', () => {
  let component: CurrencyResultComponent;
  let fixture: ComponentFixture<CurrencyResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyResultComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display result when provided', () => {
    fixture.componentRef.setInput('result', { value: 4.25 });
    fixture.componentRef.setInput('currencyCode', 'EUR');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.success-box')).toBeTruthy();
    expect(compiled.textContent).toContain('EUR');
    expect(compiled.textContent).toContain('4.25');
  });

  it('should not display result when null', () => {
    fixture.componentRef.setInput('result', null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.success-box')).toBeFalsy();
  });

  it('should uppercase currency code', () => {
    fixture.componentRef.setInput('result', { value: 3.99 });
    fixture.componentRef.setInput('currencyCode', 'usd');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('USD');
  });
});
