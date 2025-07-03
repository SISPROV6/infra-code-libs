import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibDateRangePickerComponent } from './lib-date-range-picker.component';

describe('LibDateRangePickerComponent', () => {
  let component: LibDateRangePickerComponent;
  let fixture: ComponentFixture<LibDateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibDateRangePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
