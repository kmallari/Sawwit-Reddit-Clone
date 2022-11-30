import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRightbarComponent } from './chat-rightbar.component';

describe('ChatRightbarComponent', () => {
  let component: ChatRightbarComponent;
  let fixture: ComponentFixture<ChatRightbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRightbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatRightbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
