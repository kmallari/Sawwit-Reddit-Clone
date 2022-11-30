import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubredditComponent } from './update-subreddit.component';

describe('UpdateSubredditComponent', () => {
  let component: UpdateSubredditComponent;
  let fixture: ComponentFixture<UpdateSubredditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSubredditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSubredditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
