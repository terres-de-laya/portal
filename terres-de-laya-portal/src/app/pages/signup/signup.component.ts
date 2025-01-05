import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk/directives/item';
import { TuiAlertService, TuiButton, TuiIcon, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiPassword, TuiRadio } from '@taiga-ui/kit';
import { AuthService } from '../../services/auth.service';

export const StrongPasswordRegx: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// Custom validator function
function roleRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const status = control.get('status')?.value;
  const role = control.get('role')?.value;
  if (status === 'autre' && !role) {
    return { roleRequired: true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  imports: [
    TuiButton,
    TuiTextfield,
    TuiIcon,
    TuiPassword,
    RouterLink,
    ReactiveFormsModule,
    TuiRadio,
    TuiBreadcrumbs,
    FormsModule,
    RouterLink, TuiBreadcrumbs, TuiItem, TuiLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
    username: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9]+$')]),
    lastName: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    role: new FormControl(''),
    apartmentNumber: new FormControl('', Validators.required),
  });

  get passwordFormField() {
    return this.signUpForm.get('password');
  }

  get usernameFormField() {
    return this.signUpForm.get('username');
  }

  constructor(private fb: FormBuilder, private alerts: TuiAlertService, private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9]+$')]],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      status: ['', Validators.required],
      role: [''],
      apartmentNumber: ['', Validators.required],
    }, { validators: roleRequiredValidator });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const { email, password, username, lastName, firstName, apartmentNumber, status, role } = this.signUpForm.value;
      if (email && password && username && lastName && firstName && apartmentNumber && status) {
        this.authService.createUser(email, password, username, lastName, firstName, apartmentNumber, status, role)
          .subscribe({
            next: () => {
              this.alerts.open('Registration successful! <strong>Please check your email for confirmation.</strong>', { label: 'Success', appearance: 'positive' }).subscribe();
              this.router.navigate(['/home']);
            },
            error: (err) => this.alerts.open('Registration failed: <strong>' + err.message + '</strong>', { label: 'Error', appearance: 'negative' }).subscribe()
          });
      }
    }
  }
}
