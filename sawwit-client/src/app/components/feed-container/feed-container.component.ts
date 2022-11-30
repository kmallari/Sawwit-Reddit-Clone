import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/post.model';
import { Subreddit } from 'src/app/models/subreddit.model';
import { SubredditsService } from 'src/app/services/subreddits.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-feed-container',
  templateUrl: './feed-container.component.html',
  styleUrls: ['./feed-container.component.css'],
})
export class FeedContainerComponent implements OnInit {
  constructor(
    private postsService: PostsService,
    private _subredditsService: SubredditsService,
    private _auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.getAllPostsUsingPagination();
    this.getRecentSubreddits();
  }

  posts: Post[] = [];
  isLogin: boolean = this._auth.isLogin;
  loggedInUser?: User = this._auth.loggedInUser;
  recentSubreddits: Subreddit[] = [];
  page: number = 1;

  // getAllPosts(): void {
  //   this.postsService.getAllPosts().subscribe((posts) => {
  //     this.posts = posts;
  //   });
  // }

  getAllPostsUsingPagination(): void {
    const userId = this.loggedInUser ? this.loggedInUser.id : 'xxx';
    this.postsService
      .getAllPostsUsingPagination(String(this.page), '10', userId)
      .subscribe((posts) => {
        this.posts = this.posts.concat(posts);
      });
  }

  getRecentSubreddits(): void {
    this._subredditsService.getRecentSubreddits(10).subscribe((subreddits) => {
      this.recentSubreddits = subreddits;
    });
  }

  onScroll() {
    this.page++;
    this.getAllPostsUsingPagination();
  }
}
