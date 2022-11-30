import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

// dito icheck yung islogin !!

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sawwit-client';
  isChat = false;
  constructor(private _auth: AuthService, private _router: Router) {
    this._auth.getUserDetails();
    this._auth.isUserLoggedIn();
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.split('/')[1] && 'chat' === event.url.split('/')[1]) {
          console.log('hello');
          this.isChat = true;
        } else {
          this.isChat = false;
        }
      }
    });
  }
}
