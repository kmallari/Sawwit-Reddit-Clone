import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Room } from 'src/app/models/room.model';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat-rightbar',
  templateUrl: './chat-rightbar.component.html',
  styleUrls: ['./chat-rightbar.component.css'],
})
export class ChatRightbarComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _usersService: UsersService,
    private _chatService: ChatService,
    private _route: ActivatedRoute,
    private _toastr: ToastrService
  ) {
    this.roomId = this._route.snapshot.params['roomId'];
  }

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(500),
        // ignore new term if same as previous term
        distinctUntilChanged()
        // switchMap((term: string) => this.movieService.searchMovies(term))
      )
      .subscribe((term) => {
        this.getSearched(term);
      });
  }

  loggedInUser?: User = this._auth.loggedInUser;
  searchedUsers: User[] = [];
  private searchTerms = new Subject<string>();
  usersInGroup: User[] = [];
  roomId: string;
  newRoomName: string = '';
  @Input() room!: Room;
  @Input() participants!: any[];

  removeFromArray(a: User[], user: User) {
    a = a.filter((u) => u.id !== user.id);
    return a;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  getSearched(term: string): void {
    if (term) {
      this._usersService.searchUser(term).subscribe((users) => {
        if (this.loggedInUser) {
          users = this.removeFromArray(users, this.loggedInUser);
          for (let user of this.usersInGroup) {
            users = this.removeFromArray(users, user);
          }
          this.searchedUsers = users;
        }
      });
    }
  }

  addToGroup = (user: User) => {
    this.usersInGroup.push(user);
    this.searchedUsers = this.removeFromArray(this.searchedUsers, user);
  };

  inviteUsersToRoom = () => {
    if (this.loggedInUser)
      this._chatService
        .inviteUsersToRoom(
          this.roomId,
          this.usersInGroup,
          this.loggedInUser,
          this.room.name,
          this.room.roomImage
        )
        .subscribe(
          (res: any) => {
            // console.log(res);
          },
          (err: any) => {
            console.error(err);
          }
        );
    this.usersInGroup = [];
    this._toastr.success(
      `The user/s have been successfully invited to the room. Please wait for their response.`,
      'Successfully invited!'
    );
  };

  changeRoomName = () => {
    if (this.loggedInUser)
      this._chatService
        .changeRoomName(this.roomId, this.newRoomName)
        .subscribe((res: any) => {
          // console.log(res);
          window.location.reload();
        });
  };

  handleRemoveFromList = (user: User) => {
    this.usersInGroup = this.removeFromArray(this.usersInGroup, user);
  };
}
