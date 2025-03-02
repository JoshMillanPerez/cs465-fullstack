import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trips';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api'; // Adjust to your API URL
  private url = `${this.apiBaseUrl}/trips`; // Use template literal properly

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData); // Fixed parameter name and string literal
  }

  getTrip(tripCode: string): Observable<Trip> { // Changed return type to single Trip
    return this.http.get<Trip>(`${this.url}/${tripCode}`); // Proper template literal
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.url}/${formData.code}`, formData);
  }

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }
  
  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }
    
  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url = `${this.apiBaseUrl}/${urlPath}`; // Fixed template literal syntax
    return this.http.post<AuthResponse>(url, user) // Type the response properly
      .toPromise()
      .then(response => response as AuthResponse) // response should already be parsed
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<never> {
    console.error('An error occurred:', error);
    return Promise.reject(error.message || error);
  }
}