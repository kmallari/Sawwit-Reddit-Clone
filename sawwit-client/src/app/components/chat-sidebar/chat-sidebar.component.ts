import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { Room } from '../../models/room.model';
import { User } from '../../models/user.model';
import { Invite } from '../../models/invitate.model';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css'],
})
export class ChatSidebarComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _chatService: ChatService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this._router.url.split('/')[2]) {
      this.roomId = this._router.url.split('/')[2];
      console.log('ROOMID', this.roomId);
    }

    this.getRoomsUserIsIn();
    this.getUserRoomInvitations();
  }

  tab: string = 'rooms';
  roomsUserIsIn: Room[] = [];
  invitations: Invite[] = [];
  loggedInUser?: User = this._auth.loggedInUser;
  roomId: string = '';

  getRoomsUserIsIn() {
    if (this.loggedInUser) {
      this._chatService.getRoomsUserIsIn(this.loggedInUser.id).subscribe(
        (res: any) => {
          this.roomsUserIsIn = res.data;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  getUserRoomInvitations = () => {
    if (this.loggedInUser) {
      this._chatService
        .getUserRoomInvitations(this.loggedInUser.id)
        .subscribe((res: any) => {
          this.invitations = res.data[0];
          console.log(this.invitations);
        });
    }
  };

  respondToInvitation = (roomId: string, accept: boolean) => {
    if (this.loggedInUser)
      this._chatService
        .respondToInvitation(this.loggedInUser, roomId, accept)
        .subscribe((res: any) => {
          console.log(
            '🚀 ~ file: chat-sidebar.component.ts ~ line 51 ~ ChatSidebarComponent ~ .subscribe ~ res',
            res
          );
        });
    this.removeFromInvitations(roomId);
    this._toastr.success(
      `You have successfully ${
        accept ? 'accepted' : 'rejected'
      } the invitation!`,
      'Successfully responded!'
    );
  };

  handleTabChange = (tab: string) => {
    this.tab = tab;
  };

  getTimeAgo(date: number): string {
    return moment(date).fromNow();
  }

  removeFromInvitations = (roomId: string) => {
    this.invitations = this.invitations.filter(
      (invite) => invite.roomId !== roomId
    );
  };

  handleRoomClick = (roomId: string) => {
    this.roomId = roomId;
  };
}
