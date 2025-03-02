import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule] // Add NavbarComponent
})

export class NavbarComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit() { }
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
  public onLogout(): void {
    return this.authenticationService.logout();
  }
}
