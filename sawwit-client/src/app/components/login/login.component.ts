import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private fb: FormBuilder, private _auth: AuthService) {
    this.loginForm = this.fb.group({
      loginInfo: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  loginForm: FormGroup;
  isLogin: boolean = this._auth.isLogin;
  errorMessage: any;
  invalidLogin: boolean = false;
  @Output() onLoginUser: EventEmitter<any> = new EventEmitter();

  onFormSubmit(form: FormGroup) {
    if (form.valid) {
      console.log('VALID FORM');
      this.onLoginUser.emit({
        loginForm: form,
        callback: (token: string) => {
          if (!token) {
            this.invalidLogin = true;
          }
        },
        errorCallback: (err: Error) => {
          this.invalidLogin = true;
        },
      });
    }
  }

  setInvalidLogin() {
    if (this.invalidLogin) this.invalidLogin = false;
  }
}
