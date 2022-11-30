import { Component, OnInit, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Comment } from '../../models/comment.model';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-comments-container',
  templateUrl: './comments-container.component.html',
  styleUrls: ['./comments-container.component.css'],
})
export class CommentsContainerComponent implements OnInit {
  constructor(
    private _commentsService: CommentsService,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getParentComments();
    // after nito, this.comments = array
  }

  comments: Comment[] = [];
  @Input() postId: string = '';
  loggedInUser?: User = this._auth.loggedInUser;

  addComments(comments: Comment[], parentId: string): void {
    const parentIndex = this.comments.findIndex(
      (comment) => comment.id === parentId
    );
    this.comments.splice(parentIndex + 1, 0, ...comments);
  }

  getParentComments(): void {
    const userId = this.loggedInUser ? this.loggedInUser.id : 'x';

    this._commentsService
      .getParentComments(this.postId, userId)
      .subscribe((comments) => {
        this.comments = comments;

        // changes the isChildrenRevealed attribute of a comment to true if
        // the children have been revealed

        const parentCommentsIds = new Set();
        let parentId = '';

        for (let i = 0; i < this.comments.length; i++) {
          parentId = this.comments[i].parentId;
          parentCommentsIds.add(parentId);
        }
        for (let i = 0; i < this.comments.length; i++) {
          let id = this.comments[i].id;
          if (parentCommentsIds.has(id)) {
            this.comments[i].isChildrenRevealed = true;
          }
        }
      });
  }

  getNextComments(event: { postId: string; parentId: string }): void {
    // yung parent na kinukuhanan ng subcoments, pwedeng imutate para yung revealChildren = true
    const userId = this.loggedInUser ? this.loggedInUser.id : 'x';

    this._commentsService
      .getNextComments(event.postId, event.parentId, userId)
      .subscribe((comments) => {
        this.addComments(comments, event.parentId);
      });
  }

  createComment(event: {
    userId: string;
    username: string;
    parentId: string;
    content: string;
    postId: string;
    parentLevel: number;
  }): void {
    console.log(
      event.userId,
      event.username,
      event.parentId,
      event.content,
      event.postId,
      event.parentLevel
    );

    if (
      event.userId &&
      event.username &&
      event.parentId &&
      event.content &&
      event.postId &&
      event.parentLevel !== undefined
    ) {
      this._commentsService
        .createComment(
          event.userId,
          event.username,
          event.parentId,
          event.content,
          event.postId,
          event.parentLevel
        )
        .subscribe((comment) => {
          console.log(comment);
          this.addComments([comment], event.parentId);
        });
    }
  }

  voteComment(event: {
    postId: string;
    commentId: string;
    userId: string;
    vote: number;
  }): void {
    this._commentsService
      .voteComment(event.postId, event.commentId, event.userId, event.vote)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
