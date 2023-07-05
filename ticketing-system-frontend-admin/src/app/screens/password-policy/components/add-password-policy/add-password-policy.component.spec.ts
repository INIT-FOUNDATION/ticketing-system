import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPasswordPolicyComponent } from './add-password-policy.component';

describe('AddPasswordPolicyComponent', () => {
  let component: AddPasswordPolicyComponent;
  let fixture: ComponentFixture<AddPasswordPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPasswordPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPasswordPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
