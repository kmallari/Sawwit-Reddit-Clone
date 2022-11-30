import { Component, Input, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';
@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  @Input() posts: Post[] = [];
  constructor(private _postsService: PostsService) {}

  ngOnInit(): void {}

  votePost(event: { postId: string; userId: string; vote: number }): void {
    this._postsService
      .votePost(event.postId, event.userId, event.vote)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
