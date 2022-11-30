import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLogin: boolean = this._auth.isLogin;
  user?: User = this._auth.loggedInUser;

  constructor(
    private router: Router,
    private _auth: AuthService,
    private _usersService: UsersService,
    private _router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; // refreshes page on route change

    console.log(this.isLogin);
  }

  logout() {
    this._auth.clearStorage();
    this.router.navigate(['/']);
    window.location.reload();
  }

  ngOnInit(): void {}

  loginUser(event: {
    loginForm: FormGroup;
    callback: (token: string) => {};
    errorCallback: (error: Error) => {};
  }) {
    this._usersService
      .login(event.loginForm.value.loginInfo, event.loginForm.value.password)
      .subscribe(
        (res: any) => {
          if (res.token) {
            this._auth.setDataInCookies('userData', JSON.stringify(res.data));
            this._auth.setDataInCookies('token', res.token);
            window.location.reload();
          }
          event.callback(res.token);
        },
        (err) => {
          event.errorCallback(err);
        }
      );
  }

  signupUser(event: {
    signupForm: FormGroup;
    errorCallback: (error: Error) => {};
  }): void {
    this._usersService
      .register(
        event.signupForm.value.email,
        event.signupForm.value.username,
        event.signupForm.value.password
      )
      // sa subscribe pwede maglagay ng error handler
      .subscribe(
        (res: any) => {
          if (res.token) {
            // console.log(res);
            this._auth.setDataInCookies('userData', JSON.stringify(res.data));
            this._auth.setDataInCookies('token', res.token);
            this._router.navigate(['/home']);
            window.location.reload();
          } else {
            // console.log(res);
            alert(res.msg);
          }
        },
        (error) => {
          event.errorCallback(error);
        }
      );
  }
}
