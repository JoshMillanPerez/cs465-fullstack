import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formError: string | null = null;
  public credentials: User = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  public onLoginSubmit(): void {
    console.log('Form submitted with:', this.credentials);
    this.formError = null;
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      console.log('Validation failed:', this.formError);
      return;
    }
    this.doLogin();
  }

  private doLogin(): void {
    console.log('Attempting login...');
    this.authenticationService.login(this.credentials)
      .then(() => {
        console.log('Login successful, navigating...');
        this.router.navigateByUrl('/');
      })
      .catch((message) => {
        console.error('Login error:', message);
        this.formError = message;
      });
  }

  public onButtonClick(): void {
    console.log('Button clicked'); // Debug logging for button click
  }
}