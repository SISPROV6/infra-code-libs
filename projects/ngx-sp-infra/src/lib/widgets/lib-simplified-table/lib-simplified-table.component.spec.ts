import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibSimplifiedTableComponent } from './lib-simplified-table.component';

describe('Componente: lib-simplified-table', () => {
  let component: LibSimplifiedTableComponent;
  let fixture: ComponentFixture<LibSimplifiedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibSimplifiedTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibSimplifiedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
