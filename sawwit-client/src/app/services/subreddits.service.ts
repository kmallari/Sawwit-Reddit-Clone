import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Subreddit } from '../models/subreddit.model';

@Injectable({
  providedIn: 'root',
})
export class SubredditsService {
  private url = 'http://localhost:8080/subreddits';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}
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

  getSubredditInfo(name: string): Observable<Subreddit> {
    return this.http
      .get<Subreddit>(this.url + '/' + name, this.httpOptions)
      .pipe(
        tap((_) => {
          // console.log('TAP', _);
        }),
        catchError(this.handleError<any>('getSubredditInfo'))
      );
  }

  getRecentSubreddits(count: number): Observable<Subreddit[]> {
    return this.http
      .get<Subreddit[]>(this.url + `/recent?count=${count}`, this.httpOptions)
      .pipe(
        tap((_) => {
          // console.log(_)
        }),
        catchError(this.handleError<any>('getRecentSubreddit'))
      );
  }

  searchSubreddit(name: string): Observable<Subreddit[]> {
    if (!name.trim()) {
      return of([]);
    }
    return this.http
      .get<Subreddit[]>(
        this.url + `/search?searchTerm=${name}`,
        this.httpOptions
      )
      .pipe(
        tap((_) => {
          // console.log('TAP', _);
        }),
        catchError(this.handleError<any>('searchSubreddit'))
      );
  }

  createSubreddit(name: string, description: string): Observable<Subreddit> {
    return this.http
      .post<Subreddit>(this.url, {
        subredditName: name,
        description: description,
      })
      .pipe(
        tap((_) => {},
        catchError(this.handleError<Subreddit>('createSubreddit')))
      );
  }

  updateSubreddit = (
    name: string,
    body: { description?: string; icon?: File }
  ): Observable<any> => {
    const formData = new FormData();

    for (let key in body) {
      formData.append(key, (body as any)[key]);
    }

    return this.http
      .patch(this.url + '/' + name, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        tap((_) => {
          // console.log('TAP', _);
        }),
        catchError(this.handleError<Subreddit>('updateSubreddit'))
      );
  };
}
