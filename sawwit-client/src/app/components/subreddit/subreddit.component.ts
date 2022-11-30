import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';
import { SubredditsService } from 'src/app/services/subreddits.service';
import { ActivatedRoute } from '@angular/router';
import { Subreddit } from 'src/app/models/subreddit.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css'],
})
export class SubredditComponent implements OnInit {
  constructor(
    private postsService: PostsService,
    private subredditsService: SubredditsService,
    private route: ActivatedRoute,
    private _auth: AuthService
  ) {
    this.subredditName = String(this.route.snapshot.paramMap.get('subreddit'));
  }

  ngOnInit(): void {
    this.getSubredditPostsUsingPagination();
    this.getSubredditInfo();
  }

  posts: Post[] = [];
  subredditName: string;
  subreddit?: Subreddit; // NEED TO PASS THIS INTO SUBMIT -> SEARCH
  isLogin: boolean = this._auth.isLogin;
  loggedInUser?: User = this._auth.loggedInUser;
  page: number = 1;

  // getSubredditPosts = () => {
  //   this.postsService
  //     .getSubredditPosts(this.subredditName)
  //     .subscribe((posts) => {
  //       this.posts = posts;
  //     });
  // };

  getSubredditPostsUsingPagination = () => {
    const userId = this.loggedInUser ? this.loggedInUser.id : 'xxx';

    this.postsService
      .getSubredditPostsUsingPagination(
        this.subredditName,
        String(this.page),
        '10',
        userId
      )
      .subscribe((posts) => {
        console.log(posts);
        this.posts = this.posts.concat(posts);
      });
  };

  onScroll() {
    console.log('GETTING NEW PAGE');
    this.page++;
    this.getSubredditPostsUsingPagination();
  }

  getSubredditInfo = () => {
    this.subredditsService
      .getSubredditInfo(this.subredditName)
      .subscribe((res: Subreddit) => {
        this.subreddit = res;
      });
  };
}
