import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { CommentsService } from 'src/app/services/comments.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-make-comment',
  templateUrl: './make-comment.component.html',
  styleUrls: ['./make-comment.component.css'],
})
export class MakeCommentComponent implements OnInit {
  createCommentForm: FormGroup;
  user?: User = this._auth.loggedInUser;
  isLogin: boolean = this._auth.isLogin;
  @Input() parentId?: string;
  @Input() parentLevel?: number;
  @Output() onCreateComment: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private _auth: AuthService,
    private _route: ActivatedRoute
  ) {
    this.createCommentForm = this.fb.group({
      content: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  createComment(form: FormGroup, parentId: string, parentLevel: number) {
    if (this.user && form.value.content !== '') {
      const postId = String(this._route.snapshot.paramMap.get('postId'));
      const userId = this.user.id;
      const username = this.user.username;
      const content = form.value.content;
      this.onCreateComment.emit({
        userId,
        username,
        parentId,
        content,
        postId,
        parentLevel,
      });
    }
  }
}
