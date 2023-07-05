import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeScreenAccessDialogComponent } from './customize-screen-access-dialog.component';

describe('CustomizeScreenAccessDialogComponent', () => {
  let component: CustomizeScreenAccessDialogComponent;
  let fixture: ComponentFixture<CustomizeScreenAccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizeScreenAccessDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeScreenAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
