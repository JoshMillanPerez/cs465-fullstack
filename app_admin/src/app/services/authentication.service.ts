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

  public async login(user: User): Promise<void> {
    try {
      const authResp = await this.tripDataService.login(user);
      if (authResp && authResp.token) {
        this.saveToken(authResp.token);
        console.log('Token saved:', authResp.token);
      } else {
        throw new Error('No token received from login');
      }
    } catch (error) {
      throw error;
    }
  }

  public async register(user: User): Promise<void> {
    try {
      const authResp = await this.tripDataService.register(user);
      if (authResp && authResp.token) {
        this.saveToken(authResp.token);
        console.log('Token saved:', authResp.token);
      } else {
        throw new Error('No token received from register');
      }
    } catch (error) {
      throw error;
    }
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
        return false;
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
        return null;
      }
    }
    return null;
  }
}