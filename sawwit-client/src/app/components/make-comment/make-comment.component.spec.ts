import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeCommentComponent } from './make-comment.component';

describe('MakeCommentComponent', () => {
  let component: MakeCommentComponent;
  let fixture: ComponentFixture<MakeCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
