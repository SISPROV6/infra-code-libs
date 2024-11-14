import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibHeaderComponent } from './lib-header.component';

describe('AppComponent', () => {
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


  it('deve renderizar o componente corretamente', () => {
    const fixture = TestBed.createComponent(LibHeaderComponent);
    const header = fixture.componentInstance;
    expect(header).toBeTruthy();
   });
   
   it('deve ter uma lista de breadcrumbs', () => {
      const fixture = TestBed.createComponent(LibHeaderComponent);
      const header = fixture.componentInstance;
      expect(header.breadcrumbList).toBeTruthy();
  });
});