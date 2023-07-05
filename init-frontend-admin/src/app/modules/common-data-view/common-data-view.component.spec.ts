import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDataViewComponent } from './common-data-view.component';

describe('CommonDataViewComponent', () => {
  let component: CommonDataViewComponent;
  let fixture: ComponentFixture<CommonDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonDataViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
