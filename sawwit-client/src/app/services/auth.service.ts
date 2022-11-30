import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private cookieService: CookieService) {}
  isLogin: boolean = false; // persisting
  loggedInUser?: User;

  getUserDetails() {
    if (!this.cookieService.get('userData')) return undefined;
    this.loggedInUser = JSON.parse(this.cookieService.get('userData'));
    return this.loggedInUser;
  }

  setDataInCookies(variableName: string, data: any) {
    this.cookieService.set(variableName, data);
  }

  getToken() {
    return this.cookieService.get('token');
  }

  clearStorage() {
    this.cookieService.deleteAll('*');
  }

  isUserLoggedIn() {
    if (this.getUserDetails() !== undefined) {
      this.isLogin = true;
    }
  }
}
