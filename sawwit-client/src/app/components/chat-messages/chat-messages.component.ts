import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/models/room.model';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css'],
})
export class ChatMessagesComponent implements OnInit, OnDestroy {
  constructor(
    private _chatService: ChatService,
    private _route: ActivatedRoute,
    private _auth: AuthService
  ) {
    this.roomId = this._route.snapshot.params['roomId'];
  }

  ngOnInit(): void {
    this.getMessages();
    this.subjectSubscription = this._chatService
      .getNewMessage()
      .subscribe((messageInfo: Message) => {
        this.roomMessages.unshift(messageInfo);
      });
    console.log(this.page);
  }

  ngOnDestroy(): void {
    this.subjectSubscription.unsubscribe();
    this._chatService.destroyNewMessageListener();
  }

  newMessage: string = '';
  roomMessages: Message[] = [];
  roomId: string;
  @Input() room!: Room;
  loggedInUser?: User = this._auth.loggedInUser;
  subjectSubscription: any = null;
  page: number = 1;

  getMessages = () => {
    console.log(this.page);

    this._chatService
      .getRoomMessages(this.roomId, this.page, 100)
      .subscribe((data: any) => {
        this.roomMessages = this.roomMessages.concat(data.data);
        console.log(data.data);
      });
  };

  sendMessage = (roomId: string) => {
    if (this.loggedInUser) {
      this._chatService.sendMessage(
        this.loggedInUser,
        this.roomId,
        this.newMessage
      );
      this.newMessage = '';
    }
  };

  getTimeAgo = (time: number) => {
    return moment(time).fromNow();
  };

  onScroll = () => {
    console.log('getting new messages');
    // this.page++;
    // this.getMessages();
  };
}
