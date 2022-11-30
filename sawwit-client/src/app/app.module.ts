import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarLeftComponent } from './components/sidebar-left/sidebar-left.component';
import { CreateSubredditComponent } from './components/create-subreddit/create-subreddit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { FeedContainerComponent } from './components/feed-container/feed-container.component';
import { SubmitPostComponent } from './components/submit-post/submit-post.component';
import { AutosizeModule } from 'ngx-autosize';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostComponent } from './components/post/post.component';
import { SubredditComponent } from './components/subreddit/subreddit.component';
import { UserComponent } from './components/user/user.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommentsContainerComponent } from './components/comments-container/comments-container.component';
import { CommentComponent } from './components/comment/comment.component';
import { AuthModule } from './auth/auth/auth.module';
import { CookieService } from 'ngx-cookie-service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MakeCommentComponent } from './components/make-comment/make-comment.component';
import { CreatePostCtaComponent } from './components/create-post-cta/create-post-cta.component';
import { UpdateUserProfileComponent } from './components/update-user-profile/update-user-profile.component';
import { UpdateSubredditComponent } from './components/update-subreddit/update-subreddit.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';
import { ChatMessagesComponent } from './components/chat-messages/chat-messages.component';
import { StartChatComponent } from './components/start-chat/start-chat.component';
import { ChatRightbarComponent } from './components/chat-rightbar/chat-rightbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarLeftComponent,
    CreateSubredditComponent,
    PostsListComponent,
    PostCardComponent,
    FeedContainerComponent,
    SubmitPostComponent,
    PostComponent,
    SubredditComponent,
    UserComponent,
    CommentsContainerComponent,
    CommentComponent,
    SearchBarComponent,
    FooterComponent,
    MakeCommentComponent,
    CreatePostCtaComponent,
    UpdateUserProfileComponent,
    UpdateSubredditComponent,
    ChatComponent,
    ChatSidebarComponent,
    ChatMessagesComponent,
    StartChatComponent,
    ChatRightbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AutosizeModule,
    InfiniteScrollModule,
    CKEditorModule,
    AuthModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
