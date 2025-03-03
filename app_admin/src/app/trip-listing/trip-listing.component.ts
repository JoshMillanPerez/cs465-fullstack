import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component'; // Keep NavbarComponent
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trips';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, NavbarComponent], // Remove TripCardComponent
  templateUrl: './trip-listing.component.html',
  styleUrls: ['./trip-listing.component.css'],
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  message: string = '';

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  private loadTrips(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: Trip[]) => {
          this.trips = value;
          this.message = value.length > 0 ? `There are ${value.length} trips available.` : 'No trips retrieved';
          console.log(this.message);
          console.log('Trips:', this.trips);
        },
        error: (error: any) => {
          console.error('Error fetching trips:', error);
          this.message = 'Error fetching trips';
        }
      });
  }

  public addTrip(): void {
    this.router.navigate(['/add-trip']);
  }

  public editTrip(trip: Trip): void {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['/edit-trip']);
  }

  public getImageUrl(image: string): string {
    return image ? `http://localhost:3000/images/${image}` : 'assets/images/default-trip.jpg';
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}