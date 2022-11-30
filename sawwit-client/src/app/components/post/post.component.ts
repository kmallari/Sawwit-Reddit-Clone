import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { Subreddit } from 'src/app/models/subreddit.model';
import { PostsService } from 'src/app/services/posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/models/comment.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  constructor(
    private _postsService: PostsService,
    private _route: ActivatedRoute,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    const postId = String(this._route.snapshot.paramMap.get('postId'));
    this.getPostInfo(postId);

    // magswitchmap para makuha yung cached comments
  }

  postData: Post | null = null;
  comments: Comment[] = [];
  loggedInUser?: User = this._auth.loggedInUser;

  getPostInfo(id: string): void {
    const userId = this.loggedInUser ? this.loggedInUser.id : 'xxx';
    this._postsService.getPost(id, userId).subscribe((data) => {
      this.postData = data;
      // console.log(this.postData);
    });
  }

  votePost(event: { postId: string; userId: string; vote: number }): void {
    this._postsService
      .votePost(event.postId, event.userId, event.vote)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
