import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subreddit } from 'src/app/models/subreddit.model';
import { SubredditsService } from 'src/app/services/subreddits.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-subreddit',
  templateUrl: './create-subreddit.component.html',
  styleUrls: ['./create-subreddit.component.css'],
})
export class CreateSubredditComponent implements OnInit {
  createSubredditForm: FormGroup;
  isLogin: boolean = this._auth.isLogin;

  constructor(
    private fb: FormBuilder,
    private _subredditsService: SubredditsService,
    private _router: Router,
    private _auth: AuthService
  ) {
    this.createSubredditForm = this.fb.group({
      subreddit: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  createSubreddit(form: FormGroup) {
    this._subredditsService
      .createSubreddit(form.value.subreddit, form.value.description)
      .subscribe((res: Subreddit) => {
        console.log(res);
        this._router.navigate(['/s/' + res.name]);
      });
  }
}
