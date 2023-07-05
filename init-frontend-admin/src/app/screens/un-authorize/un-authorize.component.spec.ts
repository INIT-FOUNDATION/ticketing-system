import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnAuthorizeComponent } from './un-authorize.component';

describe('UnAuthorizeComponent', () => {
  let component: UnAuthorizeComponent;
  let fixture: ComponentFixture<UnAuthorizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnAuthorizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
