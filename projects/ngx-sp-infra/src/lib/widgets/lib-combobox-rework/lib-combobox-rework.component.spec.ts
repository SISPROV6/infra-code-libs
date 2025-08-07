import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibComboboxReworkComponent } from './lib-combobox-rework.component';

describe('LibComboboxReworkComponent', () => {
  let component: LibComboboxReworkComponent;
  let fixture: ComponentFixture<LibComboboxReworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibComboboxReworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibComboboxReworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
