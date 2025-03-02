import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trips';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  trips: Trip[] = [];

  constructor(
    private tripDataService: TripDataService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loadTrips();
  }

  private loadTrips() {
    this.tripDataService.getTrips()
      .subscribe({
        next: (trips: Trip[]) => {
          console.log('Trips loaded:', trips);
          this.trips = trips;
        },
        error: (error) => {
          console.error('Error loading trips:', error);
          this.trips = [];
        }
      });
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}