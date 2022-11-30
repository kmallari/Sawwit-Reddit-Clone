import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private _router: Router,
    private _api: ApiService,
    private _auth: AuthService
  ) {
    this.signupForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  isLogin: boolean = this._auth.isLogin;
  signupForm: FormGroup;
  invalidEmail: boolean = false;
  invalidUsername: boolean = false;
  invalidPassword: boolean = false;
  errorMessage: string = '';
  @Output() onSignupUser: EventEmitter<any> = new EventEmitter();

  onFormSubmit(form: FormGroup) {
    this.isValidEmail(form.value.email);
    this.isValidUsername(form.value.username);
    this.isValidPassword(form.value.password);

    if (!this.invalidEmail && !this.invalidUsername && !this.invalidPassword) {
      if (form.valid) {
        this.onSignupUser.emit({
          signupForm: form,
          errorCallback: (err: any) => {
            this.errorMessage = err.error.message;
          },
        });
      }
    }
  }

  isValidUsername = (username: string) => {
    // username is 4-20 characters long
    // no _ at the beginning and end
    // no __* inside
    // only allows alphanumeric characters and _
    console.log(username);
    if (/^(?=[a-zA-Z0-9_]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username)) {
      this.invalidUsername = false;
    } else {
      this.invalidUsername = true;
    }
    console.log(this.invalidUsername);
  };

  isValidEmail = (email: string) => {
    console.log('TEST');
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.invalidEmail = false;
    } else {
      this.invalidEmail = true;
    }
  };

  // function for  checking if password is valid using regex
  isValidPassword = (password: string) => {
    // password is 8-20 characters long
    // at least one uppercase letter
    // at least one lowercase letter
    // at least one number
    // at least one special character
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(password)
    ) {
      this.invalidPassword = false;
    } else {
      this.invalidPassword = true;
    }
  };
}
