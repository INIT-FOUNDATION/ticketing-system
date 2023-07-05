import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonImageUploadComponent } from './common-image-upload.component';

describe('CommonImageUploadComponent', () => {
  let component: CommonImageUploadComponent;
  let fixture: ComponentFixture<CommonImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonImageUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
