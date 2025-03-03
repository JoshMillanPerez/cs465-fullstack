import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public onLogout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  public onLogin(): void {
    console.log('Log In clicked');
    this.router.navigate(['/login']);
  }

  public onBrandClick(): void {
    if (this.isLoggedIn()) {
      console.log('Brand clicked, redirecting to /list-trips');
      this.router.navigate(['/list-trips']);
    } else {
      console.log('Brand clicked, redirecting to /');
      this.router.navigate(['/']);
    }
  }
}