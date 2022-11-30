import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-chat',
  templateUrl: './start-chat.component.html',
  styleUrls: ['./start-chat.component.css'],
})
export class StartChatComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _chatService: ChatService,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  loggedInUser?: User = this._auth.loggedInUser;
  roomName: string = '';

  createRoom() {
    if (this.loggedInUser)
      this._chatService.createRoom(this.loggedInUser, this.roomName).subscribe(
        (res: any) => {
          console.log(res);
          window.location.reload();
        },
        (err: any) => {
          console.error(err);
        }
      );
  }
}
