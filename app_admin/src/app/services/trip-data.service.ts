import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Trip } from '../models/trips';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.getItem('travlr-token');
    console.log('Token for request:', token);
    if (!token) {
      console.error('No token found in storage');
    }
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  getTrips(): Observable<Trip[]> {
    console.log('Fetching trips with headers:', this.getAuthHeaders().get('Authorization'));
    return this.http.get<Trip[]>(`${this.apiBaseUrl}/trips`, { headers: this.getAuthHeaders() });
  }

  addTrip(formData: Trip): Observable<Trip> {
    console.log('Adding trip with data:', formData, 'Headers:', this.getAuthHeaders().get('Authorization'));
    return this.http.post<Trip>(`${this.apiBaseUrl}/trips`, formData, { headers: this.getAuthHeaders() });
  }

  getTrip(tripCode: string): Observable<Trip> {
    console.log('Fetching trip with code:', tripCode, 'Headers:', this.getAuthHeaders().get('Authorization'));
    return this.http.get<Trip>(`${this.apiBaseUrl}/trips/${tripCode}`, { headers: this.getAuthHeaders() });
  }

  updateTrip(formData: Trip): Observable<Trip> {
    console.log('Updating trip with data:', formData, 'Headers:', this.getAuthHeaders().get('Authorization'));
    if (!formData.code) {
      console.error('Trip code missing in formData');
    }
    return this.http.put<Trip>(`${this.apiBaseUrl}/trips/${formData.code}`, formData, { headers: this.getAuthHeaders() });
  }

  public async login(user: User): Promise<AuthResponse> {
    return await this.makeAuthApiCall('login', user);
  }

  public async register(user: User): Promise<AuthResponse> {
    return await this.makeAuthApiCall('register', user);
  }

  private async makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url = `${this.apiBaseUrl}/${urlPath}`;
    console.log('Making auth request to:', url);
    try {
      const response = await firstValueFrom(this.http.post<AuthResponse>(url, user));
      console.log('Auth response:', response);
      return response as AuthResponse;
    } catch (error: any) {
      console.error('Auth API error:', error);
      throw error;
    }
  }

  private handleError(error: any): Promise<never> {
    console.error('An error occurred:', error);
    return Promise.reject(error.message || error);
  }
}