import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.css'],
})
export class UpdateUserProfileComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private _usersService: UsersService,
    private _auth: AuthService,
    private _route: ActivatedRoute
  ) {
    this.updateUserForm = this.fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
      profilePicture: new FormControl(''),
    });
    this.id = this._route.snapshot.params['userId'];
  }

  ngOnInit(): void {
    this.getUserInfo();
    console.log('USER', this.user);
  }

  updateUserForm: FormGroup;
  newProfilePicture?: File;
  user?: User;
  imageUploadPlaceholder: string = 'Upload a new icon (Optional)';
  id: string;

  @ViewChild('fileInput', { static: false })
  InputVar?: ElementRef;

  onFileChange(event: any) {
    this.newProfilePicture = event.target.files.item(0);
    this.imageUploadPlaceholder = event.target.files.item(0).name;
  }

  updateUser = (form: FormGroup) => {
    interface Fields {
      email?: string;
      password?: string;
      profilePicture?: File;
    }

    const fieldsToUpdate: Fields = {};

    if (form.value.email.length !== 0) {
      fieldsToUpdate['email'] = form.value.email;
    }
    if (form.value.password.length !== 0) {
      fieldsToUpdate['password'] = form.value.password;
    }
    if (this.newProfilePicture) {
      fieldsToUpdate['profilePicture'] = this.newProfilePicture;
    }

    console.log(fieldsToUpdate);

    if (Object.keys(fieldsToUpdate).length !== 0) {
      if (this._auth.loggedInUser) {
        this._usersService
          .updateUser(this._auth.loggedInUser.id, fieldsToUpdate)
          .subscribe(
            (res: any) => {
              console.log('res', res);

              // if (this.user) {
              //   if (fieldsToUpdate.email) {
              //     this.user.email = fieldsToUpdate.email;
              //   }
              //   if (fieldsToUpdate.profilePicture) {
              //     this.user.profilePicture =
              //       res.body.updatedFields.profilePicture;
              //   }
              // }

              // this._auth.setDataInCookies('userData', this.user);

              // form.reset();
              // this.resetFileInput();

              window.location.reload();
            },
            (error) => {
              console.error(error);
            }
          );
      }
    }
  };

  getUserInfo = (): void => {
    this._usersService.getUserInfo(this.id).subscribe((res: any) => {
      this.user = res;
    });
  };

  resetFileInput() {
    if (this.InputVar) this.InputVar.nativeElement.value = '';
  }

  getBalloonDay(date: number): string {
    return moment(date).format('MMMM Do, YYYY');
  }
}
