import { ChangeDetectionStrategy, Component, OnInit, signal, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// import { Public as PublicService } from './../../../core/services/public';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('passwordHash');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value !== confirmPassword?.value) {
    confirmPassword?.setErrors({ mismatch: true });
    return { mismatch: true };
  } else {
    if (confirmPassword?.hasError('mismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    DecimalPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})

export class Register implements OnInit {

  registrationForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    //private publicService: PublicService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      appUser: this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        passwords: this.fb.group({
          passwordHash: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', Validators.required]
        }, { validators: passwordMatchValidator })
      }),
      location: this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        area: ['', Validators.required],
        notes: ['']
      })
    });
  }

  //getters
  get name() { return this.registrationForm.get('appUser.name'); }
  get lastname() { return this.registrationForm.get('appUser.lastname'); }
  get username() { return this.registrationForm.get('appUser.username'); }
  get email() { return this.registrationForm.get('appUser.email'); }
  get phoneNumber() { return this.registrationForm.get('appUser.phoneNumber'); }
  get password() { return this.registrationForm.get('appUser.passwords.passwordHash'); }
  get confirmPassword() { return this.registrationForm.get('appUser.passwords.confirmPassword'); }
  get locationName() { return this.registrationForm.get('location.name'); }
  get address() { return this.registrationForm.get('location.address'); }
  get area() { return this.registrationForm.get('location.area'); }




  getPayload(): any {
    const appUserGroup = this.registrationForm.get('appUser') as FormGroup;
    const passwordsGroup = appUserGroup.get('passwords') as FormGroup;
    const locationGroup = this.registrationForm.get('location') as FormGroup;

    return {
      appUser: {
        username: appUserGroup.get('username')?.value,
        passwordHash: passwordsGroup.get('passwordHash')?.value,
        phoneNumber: appUserGroup.get('phoneNumber')?.value,
        name: appUserGroup.get('name')?.value,
        lastname: appUserGroup.get('lastname')?.value,
        email: appUserGroup.get('email')?.value
      },
    };
  }



  register(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
  }
}
