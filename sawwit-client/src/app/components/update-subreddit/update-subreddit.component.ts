import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subreddit } from 'src/app/models/subreddit.model';
import { SubredditsService } from 'src/app/services/subreddits.service';

@Component({
  selector: 'app-update-subreddit',
  templateUrl: './update-subreddit.component.html',
  styleUrls: ['./update-subreddit.component.css'],
})
export class UpdateSubredditComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private _subredditService: SubredditsService,
    private _route: ActivatedRoute
  ) {
    this.updateSubredditForm = this.fb.group({
      description: new FormControl(''),
      icon: new FormControl(''),
    });
    this.subredditName = this._route.snapshot.params['subreddit'];
  }

  ngOnInit(): void {
    this.getSubredditInfo();
  }

  updateSubredditForm: FormGroup;
  newIcon?: File;
  subredditName: string;
  subreddit?: Subreddit;
  imageUploadPlaceholder: string = 'Upload a new icon (Optional)';
  description: string = '';

  // for clearing the file input
  @ViewChild('fileInput', { static: false })
  InputVar?: ElementRef;

  getSubredditInfo = () => {
    this._subredditService
      .getSubredditInfo(this.subredditName)
      .subscribe((subreddit) => {
        this.subreddit = subreddit;
        this.description = subreddit.description;
      });
  };

  onFileChange = (event: any) => {
    this.newIcon = event.target.files.item(0);
    this.imageUploadPlaceholder = event.target.files.item(0).name;
  };

  updateSubreddit = (form: FormGroup) => {
    interface Fields {
      description?: string;
      icon?: File;
    }

    const fieldsToUpdate: Fields = {};

    if (form.value.description.length !== 0) {
      fieldsToUpdate['description'] = form.value.description;
    }
    if (this.newIcon) {
      fieldsToUpdate['icon'] = this.newIcon;
    }

    if (Object.keys(fieldsToUpdate).length !== 0) {
      this.description = form.value.description;
      this._subredditService
        .updateSubreddit(this.subredditName, fieldsToUpdate)
        .subscribe((data) => {
          // this.resetFileInput();
          window.location.reload();
        });
    }
  };

  resetFileInput() {
    if (this.InputVar) this.InputVar.nativeElement.value = '';
  }
}
