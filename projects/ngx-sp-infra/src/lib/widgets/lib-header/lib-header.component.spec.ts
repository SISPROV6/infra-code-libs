import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibHeaderComponent } from './lib-header.component';

describe('Componente de Header', () => {
   let component: LibHeaderComponent;
   let fixture: ComponentFixture<LibHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibHeaderComponent ],
    }).compileComponents();

    // Use runInInjectionContext para garantir que a injeção funciona corretamente
    TestBed.runInInjectionContext(() => {
      // Criação do fixture e injeção de dependências
      fixture = TestBed.createComponent(LibHeaderComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });
  });


  it('deve renderizar o componente corretamente quando chamado', () => {
    const fixture = TestBed.createComponent(LibHeaderComponent);
    const header = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(header).toBeTruthy();
  });

  it('deve ter uma lista de breadcrumbs', () => {
      const fixture = TestBed.createComponent(LibHeaderComponent);
      const header = fixture.componentInstance;
      fixture.detectChanges();

      expect(header.breadcrumbList).toBeTruthy();
  });


  it('deve usar o valor padrão "Título desconhecido..." quando o pageTitle não for informado', () => {
    const fixture = TestBed.createComponent(LibHeaderComponent);
    const header = fixture.componentInstance;
    fixture.detectChanges(); // Assegura que as alterações são refletidas
  
    expect(header.pageTitle).toBe("Título desconhecido...");
  });
  
  it('deve usar o valor do @Input() quando fornecido', () => {
    const fixture = TestBed.createComponent(LibHeaderComponent);
    const header = fixture.componentInstance;
    header.pageTitle = "Título fornecido pelo pai"; // Simula a entrada de um @Input()
    fixture.detectChanges(); // Atualiza a visualização após a entrada
  
    expect(header.pageTitle).toBe("Título fornecido pelo pai");
  });
});