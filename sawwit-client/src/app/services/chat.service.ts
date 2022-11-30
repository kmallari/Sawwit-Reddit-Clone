import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Message } from '../models/message.model';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket, private http: HttpClient) {}

  private handleError<T>(error: any) {
    return throwError(() => error);
  }

  message$: Subject<Message> = new Subject();

  private url = 'http://localhost:8080/chat';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getRoomInfo = (roomId: string) => {
    return this.http.get(`${this.url}/${roomId}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  };

  getRoomMessages = (roomId: string, start: number, limit: number) => {
    return this.http
      .get(`${this.url}/${roomId}/messages?start=${start}&limit=${limit}`)
      .pipe(catchError(this.handleError));
  };

  sendMessage = (user: User, roomId: string, message: string) => {
    this.socket.emit('sendMessage', user, roomId, message);
  };

  getNewMessage = () => {
    this.socket.on('receiveMessage', (message: Message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };

  destroyNewMessageListener = () => {
    this.socket.removeListener('receiveMessage');
    // this.socket.removeAllListeners('receiveMessage');
  };

  getRoomsUserIsIn = (userId: string) => {
    return this.http
      .get(`${this.url}/users/${userId}?start=0&limit=100`)
      .pipe(catchError(this.handleError));
  };

  inviteUsersToRoom = (
    roomId: string,
    usersToInvite: User[],
    invitor: User,
    roomName: string,
    roomImage: string
  ) => {
    return this.http
      .post(
        `${this.url}/invite/room/${roomId}`,
        {
          users: usersToInvite,
          invitor,
          roomName,
          roomImage,
        },
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  };

  getUserRoomInvitations = (userId: string) => {
    return this.http
      .get(`${this.url}/invite/user/${userId}?start=0&limit=100`)
      .pipe(catchError(this.handleError));
  };

  respondToInvitation = (user: User, roomId: string, accept: boolean) => {
    return this.http
      .post(`${this.url}/invite/room/${roomId}/response`, {
        user,
        accept,
      })
      .pipe(catchError(this.handleError));
  };

  createRoom = (invitor: User, roomName: string): Observable<any> => {
    return this.http
      .post<any>(
        this.url,
        {
          invitor,
          roomName,
        },
        this.httpOptions
      )
      .pipe(
        tap((_) => {
          console.log('TAP', _);
        }),
        catchError(this.handleError)
      );
  };

  joinRoom = (userId: string, roomId: string) => {
    this.socket.emit('joinRoom', userId, roomId);
  };

  changeRoomName = (roomId: string, roomName: string) => {
    return this.http
      .put(`${this.url}/${roomId}`, { roomName }, this.httpOptions)
      .pipe(catchError(this.handleError));
  };
}
