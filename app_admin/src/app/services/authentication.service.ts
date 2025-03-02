import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { TripDataService } from '../services/trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  public getToken(): string {
    const token = this.storage.getItem('travlr-token');
    return token || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public login(user: User): Promise<void> {
    return this.tripDataService.login(user)
      .then((authResp: AuthResponse) => {
        if (authResp.token) {
          this.saveToken(authResp.token);
        }
      });
  }

  public register(user: User): Promise<void> {
    return this.tripDataService.register(user)
      .then((authResp: AuthResponse) => {
        if (authResp.token) {
          this.saveToken(authResp.token);
        }
      });
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > (Date.now() / 1000);
      } catch (e) {
        return false; // Invalid token format
      }
    }
    return false;
  }

  public getCurrentUser(): User | null {
    const token = this.getToken();
    if (this.isLoggedIn()) {
      try {
        const { email, name } = JSON.parse(atob(token.split('.')[1]));
        return { email, name } as User;
      } catch (e) {
        return null; // Invalid token format
      }
    }
    return null; // Changed from empty return to explicit null
  }
}