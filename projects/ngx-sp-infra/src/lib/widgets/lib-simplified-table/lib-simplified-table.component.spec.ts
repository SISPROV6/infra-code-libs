import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableHeaderStructure } from '../../models/table/header-structure.model';
import { LibSimplifiedTableComponent } from './lib-simplified-table.component';


describe('Componente: lib-simplified-table', () => {
  let component: LibSimplifiedTableComponent;
  let fixture: ComponentFixture<LibSimplifiedTableComponent>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  beforeEach(async () => {
    const changeDetectorSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    const rendererSpy = jasmine.createSpyObj('Renderer2', ['setAttribute']);

    await TestBed.configureTestingModule({
      imports: [NgxPaginationModule, CommonModule],
      providers: [
        { provide: ChangeDetectorRef, useValue: changeDetectorSpy },
        { provide: Renderer2, useValue: rendererSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibSimplifiedTableComponent);
    component = fixture.componentInstance;
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
    mockRenderer = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;
  });


  // #region Testes de Propriedades e Inputs
  
  // Testes de Inputs Obrigatórios
  describe('Inputs Obrigatórios', () => {
    it('deve ter o parâmetro obrigatório de list', () => {
      // Verificar se list é obrigatório
      component.list = undefined;
      expect(component.list).toBeUndefined();
      
      const mockList = [{ id: 1, name: 'Test' }];
      component.list = mockList;
      expect(component.list).toEqual(mockList);
    });
    
    it('deve ter o parâmetro obrigatório de headers', () => {
      const mockHeaders: TableHeaderStructure[] = [
        { name: 'ID', widthClass: 'col-2' },
        { name: 'Nome', widthClass: 'col-4' }
      ];
      component.headers = mockHeaders;
      expect(component.headers).toEqual(mockHeaders);
    });
  });
  
  // Testes de Inputs Opcionais com Valores Default
  describe('Inputs Opcionais com Valores Default', () => {
    it('deve ter valores padrão para inputs opcionais', () => {
      expect(component.counts).toEqual([10, 25, 50]);
      expect(component.usePagination).toBe(true);
      expect(component.showCounter).toBe(true);
      expect(component.hoverable).toBe(true);
      expect(component.scrollable).toBe(false);
    });
    
    it('deve aceitar valores customizados para o parâmetro counts[]', () => {
      component.counts = [5, 15, 30];
      expect(component.counts).toEqual([5, 15, 30]);
    });
    
    it('deve aceitar configurações customizadas de paginação', () => {
      component.usePagination = false;
      expect(component.usePagination).toBe(false);
    });
  });
  // #endregion Testes de Propriedades e Inputs


  // #region Testes de Getters e Setters

  // Testes de Propriedades de Paginação
  describe('Testes de Propriedades de Paginação', () => {
    it('deve fazer um get e set de page corretamente', () => {
      component.page = 2;
      expect(component.page).toBe(2);
    });

    it('deve fazer um get e set de itemsPerPage corretamente', () => {
      component.itemsPerPage = 25;
      expect(component.itemsPerPage).toBe(25);
    });

    it('deve fazer um get e set de paginationID corretamente', () => {
      component.paginationID = 'customPagination';
      expect(component.paginationID).toBe('customPagination');
    });
  });

  // Testes de Cálculos Auxiliares
  describe('Testes de Cálculos Auxiliares', () => {
    beforeEach(() => {
      component.list = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      component.page = 2;
      component.itemsPerPage = 10;
    });

    it('deve calcular firstItemOfPage corretamente', () => {
      expect(component.firstItemOfPage).toBe(11);
    });

    it('deve calcular lastItemOfPage corretamente', () => {
      expect(component.lastItemOfPage).toBe(20);
    });

    it('deve calcular lastItemOfPage for last page corretamente', () => {
      component.page = 5;
      expect(component.lastItemOfPage).toBe(50);
    });

    it('deve lidar com list vazia nos cálculos', () => {
      component.list = [];
      expect(component.firstItemOfPage).toBe(11);
      expect(component.lastItemOfPage).toBe(0);
    });
  });

  // Testes de itemsDisplayText
  describe('Testes de itemsDisplayText', () => {
    it('deve exibir texto correto para list vazia', () => {
      component.list = [];
      expect(component.itemsDisplayText).toBe('Exibindo 0 registros');
    });

    it('deve exibir texto correto com paginação', () => {
      component.list = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      component.page = 2;
      component.itemsPerPage = 10;
      component.counts = [10, 25, 50];
      
      expect(component.itemsDisplayText).toBe('Exibindo 11-20 de 50 registros');
    });

    it('deve exibir texto correto sem counts', () => {
      component.list = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      component.counts = undefined;
      
      expect(component.itemsDisplayText).toBe('Exibindo 50 registros');
    });
  });
  // #endregion Testes de Getters e Setters


  // #region Testes de Métodos do Ciclo de Vida

  // Testes de ngOnInit
  describe('ngOnInit', () => {
    it('deve chamar updateCounterInfo() e validateHeaders() no init', () => {
      spyOn(component as any, 'updateCounterInfo');
      spyOn(component as any, 'validateHeaders');
      
      component.ngOnInit();
      
      expect(component['updateCounterInfo']).toHaveBeenCalled();
      expect(component['validateHeaders']).toHaveBeenCalled();
    });
  });

  // Testes de ngAfterViewInit
  describe('ngAfterViewInit', () => {
    it('deve chamar detectChanges() e updateColspanWidth()', () => {
      spyOn(component as any, 'updateColspanWidth');
      spyOn(component['_cdr'], 'detectChanges');
      
      component.ngAfterViewInit();
      
      expect(component['_cdr'].detectChanges).toHaveBeenCalled();
      expect(component['updateColspanWidth']).toHaveBeenCalled();
    });
  });

  // Testes de ngOnChanges
  describe('ngOnChanges', () => {
    it('deve lidar com alterações em list', () => {
      spyOn(component, 'resetPagination');
      spyOn(component as any, 'updateCounterInfo');
      spyOn(component as any, 'updateColspanWidth');
      
      const changes: SimpleChanges = {
        list: {
          currentValue: [{ id: 1 }],
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      };
      
      component.ngOnChanges(changes);
      
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component['updateCounterInfo']).toHaveBeenCalled();
      expect(component['updateColspanWidth']).toHaveBeenCalled();
    });

    it('deve lidar com alterações em headers', () => {
      spyOn(component, 'validateHeaders' as any);
      spyOn(component, 'updateColspanWidth' as any);
      
      const changes: SimpleChanges = {
        headers: {
          currentValue: [{ name: 'Test', widthClass: 'col-2' }],
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      };
      
      component.ngOnChanges(changes);
      
      expect(component['validateHeaders']).toHaveBeenCalled();
      expect(component['updateColspanWidth']).toHaveBeenCalled();
    });
  });
  // #endregion Testes de Métodos do Ciclo de Vida


  // #region Testes de Métodos Públicos

  // Testes de resetPagination
  describe('resetPagination()', () => {
    it('deve resetar a paginação para 1 quando a página atual exceder a quantidade total de páginas disponíveis', () => {
      component.page = 5;
      component.itemsPerPage = 10;
      const shortList = Array.from({ length: 15 }, (_, i) => ({ id: i + 1 }));
      
      component.resetPagination(shortList);
      
      expect(component.page).toBe(1);
    });

    it('não deve resetar a paginação quando a página atual for válida', () => {
      component.page = 2;
      component.itemsPerPage = 10;
      const longList = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      
      component.resetPagination(longList);
      
      expect(component.page).toBe(2);
    });

    it('deve lidar com list vazia', () => {
      component.page = 2;
      component.itemsPerPage = 10;
      
      component.resetPagination([]);
      
      expect(component.page).toBe(1);
    });
  });
  // #endregion Testes de Métodos Públicos


  // #region Testes de Métodos Privados

  // Testes de updateCounterInfo
  describe('updateCounterInfo()', () => {
    it('deve setar itemsPerPage para o primeiro de counts[] quando existe list e a paginação é usada', () => {
      component.list = [{ id: 1 }];
      component.showCounter = true;
      component.usePagination = true;
      component.counts = [15, 30, 50];
      
      component['updateCounterInfo']();
      
      expect(component.itemsPerPage).toBe(15);
    });

    it('deve setar itemsPerPage para o tamanho da lista quando não forem informados counts', () => {
      const mockList = Array.from({ length: 7 }, (_, i) => ({ id: i + 1 }));
      component.list = mockList;
      component.showCounter = true;
      component.usePagination = true;
      component.counts = undefined;
      
      component['updateCounterInfo']();
      
      expect(component.itemsPerPage).toBe(7);
    });

    it('deve setar itemsPerPage para 1 quando list estiver undefined', () => {
      component.list = undefined;
      component.showCounter = true;
      component.usePagination = true;
      
      component['updateCounterInfo']();
      
      expect(component.itemsPerPage).toBe(1);
    });
  });

  // Testes de updateColspanWidth
  describe('updateColspanWidth()', () => {
    it('deve setar o atributo colspan quando emptyListTD e headers existem', () => {
      const mockElement = jasmine.createSpyObj('HTMLTableCellElement', ['setAttribute']);
      spyOn(component['_cdr'], 'detectChanges');
      spyOn(component['_renderer'], 'setAttribute');

      component.emptyListTD = { nativeElement: mockElement };
      component.headers = [
        { name: 'Col1', widthClass: 'col-2' },
        { name: 'Col2', widthClass: 'col-4' }
      ];
      
      component['updateColspanWidth']();
      
      expect(component.colspanWidth).toBe('2');
      expect(component['_renderer'].setAttribute).toHaveBeenCalledWith(mockElement, 'colspan', '2');
      expect(component['_cdr'].detectChanges).toHaveBeenCalled();
    });

    it('não deve setar colspan quando emptyListTD for undefined', () => {
      spyOn(component['_cdr'], 'detectChanges');

      component.emptyListTD = undefined;
      component.headers = [{ name: 'Col1', widthClass: 'col-2' }];
      
      component['updateColspanWidth']();
      
      expect(mockRenderer.setAttribute).not.toHaveBeenCalled();
      expect(component['_cdr'].detectChanges).toHaveBeenCalled();
    });
  });

  // Testes de validateHeaders
  describe('validateHeaders()', () => {
    it('não deve avisar quando todos os headers usarem classes de "col"', () => {
      spyOn(console, 'warn');
      component.headers = [
        { name: 'Col1', widthClass: 'col-2' },
        { name: 'Col2', widthClass: 'col-4' }
      ];
      
      component['validateHeaders']();
      
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('não deve avisar quando todos os headers usarem classes de "w-"', () => {
      spyOn(console, 'warn');
      component.headers = [
        { name: 'Col1', widthClass: 'w-25' },
        { name: 'Col2', widthClass: 'w-75' }
      ];
      
      component['validateHeaders']();
      
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('deve avisar quando headers usar classes de largura mistas (col e w simultaneamente)', () => {
      spyOn(console, 'warn');
      component.headers = [
        { name: 'Col1', widthClass: 'col-2' },
        { name: 'Col2', widthClass: 'w-75' }
      ];
      
      component['validateHeaders']();
      
      expect(console.warn).toHaveBeenCalledWith(
        "Erro <lib-table>: A largura das colunas está em um formato inválido. Certifique-se que todas elas utilizam 'col'/'col-[n]' ou 'w-[n]'."
      );
    });

    it('deve avisar quando headers usar classes de largura inválidas', () => {
      spyOn(console, 'warn');
      component.headers = [
        { name: 'Col1', widthClass: 'custom-width' },
        { name: 'Col2', widthClass: 'another-custom' }
      ];
      
      component['validateHeaders']();
      
      expect(console.warn).toHaveBeenCalledWith(
        "Erro <lib-table>: A largura das colunas está em um formato inválido. Certifique-se que todas elas utilizam 'col'/'col-[n]' ou 'w-[n]'."
      );
    });
  });
  // #endregion Testes de Métodos Privados


  // #region Testes de Renderização do Template

  // Testes de Exibição Condicional
  describe('Testes de Exibição Condicional', () => {
    it('deve mostrar spinner quando list for undefined', () => {
      component.list = undefined;
      fixture.detectChanges();
      
      const loader = fixture.debugElement.query(By.css('.spinner-border'));
      const table = fixture.debugElement.query(By.css('.table-list'));
      
      expect(loader).toBeTruthy();
      expect(table).toBeFalsy();
    });

    it('deve mostrar a table quando list for definida', () => {
      component.list = [{ id: 1, name: 'Test' }];
      component.headers = [{ name: 'ID', widthClass: 'col-2' }];
      fixture.detectChanges();
      
      const loader = fixture.debugElement.query(By.css('.spinner-border'));
      const table = fixture.debugElement.query(By.css('.table-list'));
      
      expect(loader).toBeFalsy();
      expect(table).toBeTruthy();
    });

    it('deve mostrar counter quando showCounter for true', () => {
      component.list = [{ id: 1 }];
      component.showCounter = true;
      component.headers = [{ name: 'ID', widthClass: 'col-2' }];
      fixture.detectChanges();
      
      const counter = fixture.debugElement.query(By.css('.col-3 span'));
      expect(counter).toBeTruthy();
    });

    it('deve esconder counter quando showCounter for false', () => {
      component.list = [{ id: 1 }];
      component.showCounter = false;
      component.headers = [{ name: 'ID', widthClass: 'col-2' }];
      fixture.detectChanges();
      
      const counter = fixture.debugElement.query(By.css('.col-3 span'));
      expect(counter).toBeFalsy();
    });
  });

  // Testes de Templates Customizados
  describe('Testes de Templates Customizados', () => {
    it('deve renderizar templates customizados quando forem informados', () => {
      @Component({
        template: `<ng-template #testTemplate let-item>
          <span class="custom-content">{{item.name}}</span>
        </ng-template>`
      })
      class TestComponent {
        @ViewChild('testTemplate', { static: true }) testTemplate!: TemplateRef<any>;
      }
      
      const testFixture = TestBed.createComponent(TestComponent);
      const testComponent = testFixture.componentInstance;
      testFixture.detectChanges();
      
      component.templates = { 'TestColumn': testComponent.testTemplate };
      component.list = [{ id: 1, name: 'Test' }];
      component.headers = [{ name: 'TestColumn', widthClass: 'col-2' }];
      
      fixture.detectChanges();
      
      // Verificar o conteúdo renderizado pelo template
      const customContent = fixture.debugElement.query(By.css('.custom-content'));
      expect(customContent).toBeTruthy();
      expect(customContent.nativeElement.textContent.trim()).toBe('Test');
    });

    it('deve mostrar "Sem template de conteúdo" quando nenhum template for informado', () => {
      component.templates = {};
      component.list = [{ id: 1, name: 'Test' }];
      component.headers = [{ name: 'TestColumn', widthClass: 'col-2' }];
      
      fixture.detectChanges();
      
      const noTemplateText = fixture.debugElement.query(By.css('td i'));
      expect(noTemplateText?.nativeElement.textContent.trim()).toBe('Sem template de conteúdo');
    });
  });

  // Testes de Lista Vazia
  describe('Testes de Lista Vazia', () => {
    it('deve mostrar mensagem padrão de lista vazia quando list for vazio', () => {
      component.list = [];
      component.headers = [{ name: 'ID', widthClass: 'col-2' }];
      fixture.detectChanges();
      
      const emptyMessage = fixture.debugElement.query(By.css('td.text-center'));
      expect(emptyMessage?.nativeElement.textContent.trim()).toBe('Não há dados para serem listados.');
    });

    it('deve mostrar mensagem de lista vazia customizada quando list for vazio e a mensagem for informada', () => {
      component.list = [];
      component.emptyListMessage = 'Nenhum registro encontrado';
      component.headers = [{ name: 'ID', widthClass: 'col-2' }];
      fixture.detectChanges();
      
      const emptyMessage = fixture.debugElement.query(By.css('td.text-center'));
      expect(emptyMessage?.nativeElement.textContent.trim()).toBe('Nenhum registro encontrado');
    });
  });
  // #endregion Testes de Renderização do Template


  // #region Testes de Interação do Usuário

  // Testes de Seleção de Itens por Página
  describe('Testes de Seleção de Itens por Página', () => {
    it('deve lidar com a seleção de itens por página', () => {
      component.list = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      component.headers = [{ name: 'ID', widthClass: 'col-2' }];
      component.counts = [10, 25, 50];
      fixture.detectChanges();
      
      const select = fixture.debugElement.query(By.css('select.form-select'));
      const selectElement = select.nativeElement as HTMLSelectElement;
      
      // Simular corretamente o evento change com o target.value
      selectElement.value = '25';
      const changeEvent = new Event('change');
      Object.defineProperty(changeEvent, 'target', {
        value: { value: '25' },
        enumerable: true
      });
      
      selectElement.dispatchEvent(changeEvent);
      
      expect(component.itemsPerPage).toBe(25);
      expect(component.page).toBe(1);
    });

    // Alternativa mais simples - testar o método diretamente
    it('deve lidar com a seleção de itens por página - teste do método direto', () => {
      component.page = 3;
      const mockEvent = { target: { value: '25' } };
      
      component.onSelectChange(mockEvent);
      
      expect(component.itemsPerPage).toBe(25);
      expect(component.page).toBe(1);
    });
  });
  // #endregion Testes de Interação do Usuário


  // #region Testes de Edge Cases

  // Testes de Casos Extremos
  describe('Testes de Casos Extremos', () => {
    it('deve lidar com list undefined', () => {
      component.list = undefined;
      component.headers = [{ name: 'ID', widthClass: 'col-2' }];
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('deve lidar com array de headers vazio', () => {
      component.list = [{ id: 1 }];
      component.headers = [];
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('deve lidar com datasets grandes', () => {
      component.list = Array.from({ length: 10000 }, (_, i) => ({ id: i + 1 }));
      component.headers = [{ name: 'ID', widthClass: 'col-2' }];
      
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(component.itemsDisplayText).toContain('10000');
    });

    it('deve lidar com página além das páginas disponíveis', () => {
      component.list = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }));
      component.itemsPerPage = 10;
      component.page = 5;
      
      component.resetPagination(component.list);
      
      expect(component.page).toBe(1);
    });
  });
  // #endregion Testes de Edge Cases
  
});
