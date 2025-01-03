import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk/directives/item';
import { TuiAlertService, TuiButton, TuiIcon, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiPassword, TuiRadio } from '@taiga-ui/kit';
import { AuthService } from '../../services/auth.service';

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
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private alerts: TuiAlertService, private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      status: ['', Validators.required],
      apartmentNumber: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const { email, password, username, lastName, firstName, apartmentNumber, status } = this.signUpForm.value;
      this.authService.createUser(email, password, username, lastName, firstName, apartmentNumber, status)
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
