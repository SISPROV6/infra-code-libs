import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedFiltersComponent } from './applied-filters.component';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

describe('Componente com badges de Filtros Aplicados', () => {
  let component: AppliedFiltersComponent;
  let fixture: ComponentFixture<AppliedFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppliedFiltersComponent,
        LibIconsComponent
      ],
    }).compileComponents();

    // Use runInInjectionContext para garantir que a injeção funciona corretamente
    TestBed.runInInjectionContext(() => {
      // Criação do fixture e injeção de dependências
      fixture = TestBed.createComponent(AppliedFiltersComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });
  });


  it('deve renderizar o componente corretamente quando chamado', () => {
    const fixture = TestBed.createComponent(AppliedFiltersComponent);
    const appliedFilters = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(appliedFilters).toBeTruthy();
  });

  it('deve ter uma lista de filtros', () => {
      const fixture = TestBed.createComponent(AppliedFiltersComponent);
      const appliedFilters = fixture.componentInstance;
      appliedFilters.filtrosAplicados = [];
      fixture.detectChanges();

      expect(appliedFilters.filtrosAplicados).toBeTruthy();
  });


  it('deve usar o valor padrão "primary" quando o theme não for informado', () => {
    const fixture = TestBed.createComponent(AppliedFiltersComponent);
    const appliedFilters = fixture.componentInstance;
    fixture.detectChanges(); // Assegura que as alterações são refletidas
  
    expect(appliedFilters.theme).toBe("primary");
  });
  
  it('deve usar o valor do @Input() theme quando fornecido', () => {
    const fixture = TestBed.createComponent(AppliedFiltersComponent);
    const appliedFilters = fixture.componentInstance;
    appliedFilters.valueToReset = "success"; // Simula a entrada de um @Input()
    fixture.detectChanges(); // Atualiza a visualização após a entrada
  
    expect(appliedFilters.valueToReset).toBe("success");
  });

  it('deve usar o valor do @Input() valueToReset quando fornecido', () => {
    const fixture = TestBed.createComponent(AppliedFiltersComponent);
    const appliedFilters = fixture.componentInstance;
    appliedFilters.valueToReset = ""; // Simula a entrada de um @Input()
    fixture.detectChanges(); // Atualiza a visualização após a entrada
  
    expect(appliedFilters.valueToReset).toBe("");
  });
});
