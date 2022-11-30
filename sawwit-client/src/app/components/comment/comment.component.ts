import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _commentsService: CommentsService
  ) {}
  ngOnInit(): void {
    if (this.comment) {
      console.log(this.comment);
      this.indentations = Array(this.comment.level)
        .fill(0)
        .map((x, i) => i);

      this.vote = this.comment.myVote;
    }

    if (this.vote === 1 && this.comment) {
      this.comment.upvotes--;
    }

    if (this.vote === -1 && this.comment) {
      this.comment.downvotes--;
    }
  }

  @Input() comment?: Comment;
  user?: User = this._auth.loggedInUser;
  @Output() onGetNextComments: EventEmitter<any> = new EventEmitter();
  @Output() onCreateComment: EventEmitter<any> = new EventEmitter();
  indentations: number[] = [];
  showReplyBox: boolean = false;
  @Output() onVoteComment: EventEmitter<any> = new EventEmitter();
  vote: number = 0;

  getTimeAgo(date: number): string {
    return moment(date).fromNow();
  }

  getNextComments(postId: string, parentId: string): void {
    if (this.comment) this.comment.isChildrenRevealed = true;
    this.onGetNextComments.emit({ postId, parentId });
  }

  toggleReply(): void {
    this.showReplyBox = !this.showReplyBox;
  }

  onCreateNestedComment(event: Event) {
    this.onCreateComment.emit(event);
  }

  voteComment(vote: number): void {
    if (this.vote === vote) {
      this.vote = 0;
    } else {
      this.vote = vote;
    }
    
    if (this.comment && this.user) {
      const postId = this.comment.postId;
      const commentId = this.comment.id;
      const userId = this.user.id;
      this.onVoteComment.emit({ postId, commentId, userId, vote });
    }
  }

  // voteComment(vote: number) {
  //   if (this.comment && this.user) {
  //     const postId = this.comment.postId;
  //     const commentId = this.comment.id;
  //     const userId = this.user.id;
  //     this._commentsService
  //       .voteComment(postId, commentId, userId, vote)
  //       .subscribe((data) => {
  //         console.log(data);
  //       });
  //   }
  // }
}
