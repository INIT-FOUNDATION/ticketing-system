import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPolicyFormComponent } from './password-policy-form.component';

describe('PasswordPolicyFormComponent', () => {
  let component: PasswordPolicyFormComponent;
  let fixture: ComponentFixture<PasswordPolicyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordPolicyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordPolicyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
