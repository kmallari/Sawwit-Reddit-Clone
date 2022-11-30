import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  getTypeRequest(url: string) {
    return this.http.get(`${this.baseUrl}${url}`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  postTypeRequest(url: string, loginInfo: string, password: string) {
    return this.http
      .post(`${this.baseUrl}${url}`, {
        loginInfo: loginInfo,
        password: password,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
