import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when provided', () => {
    fixture.componentRef.setInput('error', 'Test error message');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-box')).toBeTruthy();
    expect(compiled.textContent).toContain('Test error message');
  });

  it('should not display error when null', () => {
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-box')).toBeFalsy();
  });

  it('should display validation errors when provided', () => {
    fixture.componentRef.setInput('error', 'Validation failed');
    fixture.componentRef.setInput('validationErrors', [
      { field: 'currency', message: 'Currency code must be 3 characters' },
      { field: 'name', message: 'Name is required' }
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('ul')).toBeTruthy();
    expect(compiled.querySelectorAll('li').length).toBe(2);
    expect(compiled.textContent).toContain('currency');
    expect(compiled.textContent).toContain('Currency code must be 3 characters');
  });

  it('should not display validation errors list when empty', () => {
    fixture.componentRef.setInput('error', 'Some error');
    fixture.componentRef.setInput('validationErrors', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('ul')).toBeFalsy();
  });
});
