import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Subreddit } from 'src/app/models/subreddit.model';

@Component({
  selector: 'app-submit-post',
  templateUrl: './submit-post.component.html',
  styleUrls: ['./submit-post.component.css'],
})
export class SubmitPostComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private router: Router, // use this to navigate to the post page
    private _auth: AuthService
  ) {
    this.createPostForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      body: new FormControl(''),
      image: new FormControl(''),
      url: new FormControl(''),
      subreddit: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  createPostForm: FormGroup;
  postId?: string;
  user?: User = this._auth.loggedInUser;
  @Input() selectedSubreddit?: Subreddit;
  imageUploadPlaceholder: string = 'Click here to upload an image.';
  imageToUpload?: File;
  type: number = 1;
  currentTitle: string = '';
  currentBody: string = '';

  createPost(form: FormGroup) {
    console.log(form.value.image);

    if (this.user && this.selectedSubreddit) {
      form.value.subreddit = this.selectedSubreddit.name;

      console.log(form.value);

      this.postsService
        .createPost(
          form.value.title,
          form.value.body,
          this.imageToUpload,
          form.value.url,
          this.user.id,
          this.user.username,
          form.value.subreddit,
          this.type
        )
        .subscribe((res: any) => {
          console.log(res);
          this.postId = res.id;
          if (this.type === 2) {
            this.router.navigate(['/s', form.value.subreddit, res.body.id]);
          } else {
            this.router.navigate(['/s', form.value.subreddit, res.id]);
          }
        });
    }
  }

  upload() {
    if (this.imageToUpload) {
      console.log(this.imageToUpload);
      this.postsService.uploadImage(this.imageToUpload).subscribe((data) => {
        console.log(data);
      });
    }
  }

  setSubreddit(subreddit: Subreddit) {
    this.selectedSubreddit = subreddit;
  }

  clearSubreddit() {
    this.selectedSubreddit = undefined;
  }

  onFileChange(event: any) {
    this.imageToUpload = event.target.files.item(0);
    if (event) this.imageUploadPlaceholder = event.target.files[0].name;
  }

  setType(newType: number) {
    this.type = newType;
    console.log(this.type);
  }
}
