import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCustomizableTableComponent } from './lib-customizable-table.component';

describe('Componente: lib-customizable-table', () => {
  let component: LibCustomizableTableComponent;
  let fixture: ComponentFixture<LibCustomizableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibCustomizableTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibCustomizableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
