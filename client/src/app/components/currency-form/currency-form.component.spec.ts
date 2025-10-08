import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CurrencyFormComponent } from './currency-form.component';

describe('CurrencyFormComponent', () => {
  let component: CurrencyFormComponent;
  let fixture: ComponentFixture<CurrencyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyFormComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.currency()).toBe('EUR');
    expect(component.name()).toBe('Jan Nowak');
  });

  it('should emit submitForm event with trimmed and uppercased data', () => {
    const mockForm = { valid: true } as any;
    let emittedValue: any;

    component.submitForm.subscribe((value) => {
      emittedValue = value;
    });

    component.currency.set(' usd ');
    component.name.set(' John Doe ');
    component.onSubmit(mockForm);

    expect(emittedValue).toEqual({
      currency: 'USD',
      name: 'John Doe'
    });
  });

  it('should not emit when form is invalid', () => {
    const mockForm = { valid: false } as any;
    let emitted = false;

    component.submitForm.subscribe(() => {
      emitted = true;
    });

    component.onSubmit(mockForm);

    expect(emitted).toBe(false);
  });

  it('should update currency signal', () => {
    component.currency.set('GBP');
    expect(component.currency()).toBe('GBP');
  });

  it('should update name signal', () => {
    component.name.set('Anna Kowalska');
    expect(component.name()).toBe('Anna Kowalska');
  });
});
