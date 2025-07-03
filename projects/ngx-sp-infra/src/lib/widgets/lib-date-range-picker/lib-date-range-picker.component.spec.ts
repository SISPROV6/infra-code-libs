import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibDateRangePickerComponent } from './lib-date-range-picker.component';

describe('Componente: lib-date-range-picker', () => {
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

  it('deve criar o componente quando chamado', () => {
    expect(component).toBeTruthy();
  });
});
