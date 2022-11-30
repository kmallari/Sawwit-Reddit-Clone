import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostCtaComponent } from './create-post-cta.component';

describe('CreatePostCtaComponent', () => {
  let component: CreatePostCtaComponent;
  let fixture: ComponentFixture<CreatePostCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePostCtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePostCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
