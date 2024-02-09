import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseService } from 'src/app/services/firebase.service'; // Import your Firebase service
import { ForgotPasswordComponent } from './forgot-password.component'; // Import your ForgotPasswordComponent

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let firebaseService: FirebaseService; // Rename authService to firebaseService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [FirebaseService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    firebaseService = TestBed.inject(FirebaseService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call firebaseService.forgotPassword() when form is submitted', () => {
    spyOn(firebaseService, 'forgotPassword');
    const emailInput = fixture.nativeElement.querySelector('#email');
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    submitButton.click();
    expect(firebaseService.forgotPassword).toHaveBeenCalledWith('test@example.com');
  });
});

