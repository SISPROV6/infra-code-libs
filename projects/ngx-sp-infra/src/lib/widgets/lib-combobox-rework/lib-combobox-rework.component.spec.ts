import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordCombobox } from './../../models/combobox/record-combobox';

import { LibComboboxReworkComponent } from './lib-combobox-rework.component';

describe('Componente: lib-combobox-rework', () => {
  let component: LibComboboxReworkComponent;
  let fixture: ComponentFixture<LibComboboxReworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibComboboxReworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibComboboxReworkComponent<RecordCombobox>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
