import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiPassword, TuiRadio } from '@taiga-ui/kit';

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
    FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder
  ) {
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
      const { email, password, username, streetAddress, city, postalCode, country, lastName, firstName, apartmentNumber, status } = this.signUpForm.value;
      alert('Registration successful! Please check your email for confirmation.');
    }
  }
}
