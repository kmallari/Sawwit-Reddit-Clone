import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { User, RegisteredUser, LoginUser } from '../models/user.model';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private url = 'http://localhost:8080/users';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  private handleError<T>(error: HttpErrorResponse) {
    return throwError(() => error);

    // return (error: any): Observable<T> => {
    //   // TODO: send the error to remote logging infrastructure
    //   console.error('Catching?', error); // log to console instead

    //   // TODO: better job of transforming error for user consumption
    //   // this.log(`${operation} failed: ${error.message}`);

    //   // Let the app keep running by returning an empty result.

    //   // add error handling here

    //   // return of(result as T);
    // };
  }

  register = (
    email: string,
    username: string,
    password: string
  ): Observable<RegisteredUser> => {
    // expected yung return ng server
    return this.http
      .post<RegisteredUser>( // tama yung type nito
        this.url + '/register',
        {
          email: email,
          username: username,
          password: password,
        },
        this.httpOptions
      )
      .pipe(
        tap((_) => {
          // console.log('TAP', _);
        })
        // if dito lang sa service yung error handling, mahirap itransfer sa ui yung error
        // catchError(this.handleError<RegisteredUser>('register'))
      );
  };

  login = (loginInfo: string, password: string): Observable<LoginUser> => {
    // console.log('serivce', loginInfo, password);
    return this.http
      .post<LoginUser>(
        this.url + '/login',
        { loginInfo: loginInfo, password: password },
        this.httpOptions
      )
      .pipe(
        tap((_) => {
          console.log('TAP', _);
        }),
        catchError(this.handleError)
      );
  };

  getUserInfo = (id: string): Observable<User> => {
    return this.http.get<User>(this.url + '/' + id).pipe(
      tap((_) => {
        // console.log('TAP', _);
      }),
      catchError(this.handleError)
    );
  };

  updateUser = (
    id: string,
    body: { email?: string; password?: string; profilePicture?: File }
  ): Observable<any> => {
    const formData = new FormData();

    for (let key in body) {
      formData.append(key, (body as any)[key]);
    }

    return this.http
      .patch(this.url + '/' + id, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        tap((_) => {
          console.log('TAP', _);
        }),
        catchError(this.handleError)
      );
  };

  searchUser = (username: string): Observable<User[]> => {
    if (!username.trim()) {
      return of([]);
    }
    return this.http.get<User[]>(
      this.url + `/search?searchTerm=${username}`,
      this.httpOptions
    );
  };
}
