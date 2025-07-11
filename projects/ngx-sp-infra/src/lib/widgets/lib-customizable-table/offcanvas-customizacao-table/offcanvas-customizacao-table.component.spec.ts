import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffcanvasCustomizacaoTableComponent } from './offcanvas-customizacao-table.component';

describe('Componente: lib-offcanvas-customizacao-table', () => {
  let component: OffcanvasCustomizacaoTableComponent;
  let fixture: ComponentFixture<OffcanvasCustomizacaoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffcanvasCustomizacaoTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffcanvasCustomizacaoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
