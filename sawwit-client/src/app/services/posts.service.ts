import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SubredditsService } from './subreddits.service';
import { catchError, tap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private http: HttpClient
  ) {}
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.

      // add error handling here

      return of(result as T);
    };
  }

  private url = 'http://localhost:8080/posts';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAllPostsUsingPagination(
    page: string,
    itemsPerPage: string,
    loggedInUserId: string
  ): Observable<Post[]> {
    return this.http
      .get<Post[]>(
        this.url +
          `/pagination?page=${page}&itemsPerPage=${itemsPerPage}&loggedInUserId=${loggedInUserId}`
      )
      .pipe(
        tap((_) => {
          // console.log(_);
        }),
        catchError(this.handleError<any>('getAllPostsUsingPagination'))
      );
  }

  getSubredditPostsUsingPagination(
    subredditName: string,
    page: string,
    itemsPerPage: string,
    loggedInUserId: string
  ): Observable<Post[]> {
    return this.http
      .get<Post[]>(
        this.url +
          `/subreddit/${subredditName}/pagination?page=${page}&itemsPerPage=${itemsPerPage}&loggedInUserId=${loggedInUserId}`
      )
      .pipe(
        tap((_) => {
          // console.log(_);
        }),
        catchError(this.handleError<any>('getSubredditPostsUsingPagination'))
      );
  }

  getUserPostsUsingPagination(
    userId: string,
    page: string,
    itemsPerPage: string,
    loggedInUserId: string
  ): Observable<Post[]> {
    return this.http
      .get<Post[]>(
        this.url +
          `/user/${userId}/pagination?page=${page}&itemsPerPage=${itemsPerPage}&loggedInUserId=${loggedInUserId}`
      )
      .pipe(
        tap((_) => {
          // console.log(_);
        }),
        catchError(this.handleError<any>('getUserPostsUsingPagination'))
      );
  }

  createPost(
    title: string,
    content: string,
    file: File | undefined,
    url: string,
    userId: string,
    username: string,
    subreddit: string,
    type: number
  ): Observable<Post> {
    if (type === 1) {
      return this.http
        .post<Post>(
          this.url + '/submit',
          {
            title: title,
            body: content,
            userId: userId,
            username: username,
            subreddit: subreddit,
            type: type,
          },
          this.httpOptions
        )
        .pipe(
          tap((_) => {
            // console.log(_);
          }),
          catchError(this.handleError<any>('createPost'))
        );
    } else if (type === 2 && file) {
      console.log('FILE', file);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('imgFile', file);
      formData.append('userId', userId);
      formData.append('username', username);
      formData.append('subreddit', subreddit);
      formData.append('type', '2');

      return this.http
        .post<Post>(this.url + '/submit', formData, {
          reportProgress: true,
          observe: 'events',
        })
        .pipe(
          tap((_) => {
            // console.log(_);
          }),
          catchError(this.handleError<any>('createPost'))
        );
    } else {
      return this.http
        .post<Post>(
          this.url + '/submit',
          {
            title: title,
            url: url,
            userId: userId,
            username: username,
            subreddit: subreddit,
            type: type,
          },
          this.httpOptions
        )
        .pipe(
          tap((_) => {
            // console.log(_);
          }),
          catchError(this.handleError<any>('createPost'))
        );
    }
  }

  getPost(id: string, userId: string): Observable<Post> {
    return this.http
      .get<Post>(this.url + '/' + id + `?loggedInUserId=${userId}`)
      .pipe(
        tap((_) => {
          // console.log(_);
        }),
        catchError(this.handleError<any>('getPost'))
      );
  }

  votePost(postId: string, userId: string, vote: number): Observable<any> {
    return this.http
      .post<any>(
        this.url + '/' + postId,
        {
          userId: userId,
          vote: vote,
        },
        this.httpOptions
      )
      .pipe(
        tap((_) => {
          // console.log(_);
        }),
        catchError(this.handleError<any>('votePost'))
      );
  }

  uploadImage(fileToUpload: File) {
    const formData = new FormData();
    formData.append('imgFile', fileToUpload);
    return this.http
      .post<any>(this.url + '/media', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        tap((_) => {
          // console.log(_);
          catchError(this.handleError<any>('uploadImage'));
        })
      );
  }
}
