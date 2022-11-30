import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { Room } from '../../models/room.model';
import { Message } from 'src/app/models/message.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  host: {
    class: 'w-100 ',
  },
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(
    private _chatService: ChatService,
    private _usersService: UsersService,
    private _auth: AuthService,
    private _route: ActivatedRoute,
    private _renderer: Renderer2
  ) {
    this._renderer.addClass(document.body, 'no-overflow');
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  ngOnInit(): void {
    this.roomId = this._route.snapshot.params['roomId'];
    if (this.roomId) {
      this.joinRoom(this.roomId);
    }
    this.getRoomInfo();
  }

  ngOnDestroy(): void {
    this._renderer.removeClass(document.body, 'no-overflow');
  }

  loggedInUser?: User = this._auth.loggedInUser;
  roomIdInput: string = '';
  roomsUserIsIn: Room[] = [];
  roomId: string = '';
  room!: Room;
  participants!: any[];

  joinRoom(roomToJoin: string) {
    if (this.loggedInUser)
      this._chatService.joinRoom(this.loggedInUser.id, roomToJoin);
  }

  getRoomInfo = () => {
    console.log('RUNS?');
    console.log(this.roomId);
    this._chatService.getRoomInfo(this.roomId).subscribe((room) => {
      this.room = room.roomInfo;
      this.participants = room.participants;
    });
  };
}
