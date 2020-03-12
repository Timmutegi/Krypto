import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { ErrorHandlingService } from '../services/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private errorHandler: ErrorHandlingService) {}
  // isLoggedIn = false;

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.clear();
    this.router.navigate(['/']);
  }

  public isAuthenticated() {
    if (localStorage.getItem('accessToken') == null) {
      return false;
    } else {
      const currentTime = new Date;
      currentTime.setTime(currentTime.getTime() + (currentTime.getTimezoneOffset() * 60 * 1000) + 10800000);
      const date = localStorage.getItem('date');
      const expiryTime = new Date(date);

        if (currentTime > expiryTime) {
          return false;
        } else {
          return true;
        }
      }
    }
}
