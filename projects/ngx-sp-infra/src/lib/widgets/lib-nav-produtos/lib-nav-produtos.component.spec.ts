import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibNavProdutosComponent, NavItem, Params } from './lib-nav-produtos.component';

describe('Coponente: lib-nav-produtos', () => {
  let component: LibNavProdutosComponent;
  let fixture: ComponentFixture<LibNavProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibNavProdutosComponent ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibNavProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('deve renderizar o componente corretamente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar internamente as opções que foram informadas para o componente', () => {
    component.navItems = [
      { caminho: '/path1', label: 'Label 1' },
      { caminho: '/path2', label: 'Label 2' }
    ];
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('.menu-item');

    expect(menuItems.length).toBe(2);
    expect(menuItems[0].textContent).toContain('Label 1');
    expect(menuItems[1].textContent).toContain('Label 2');
  });
  
  it('deve chamar onNavigate quando um item for clicado', () => {
    spyOn(component, 'onNavigate');
    component.navItems = [
      { caminho: '/path1', label: 'Label 1' }
    ];
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement;
    const menuItem = compiled.querySelector('.menu-item a');
    menuItem.click();
    expect(component.onNavigate).toHaveBeenCalledWith(component.navItems[0]);
  });
  
  it('deve construir a URL correta em onNavigate', () => {
    const navItem: NavItem = { caminho: '/path', label: 'Label', params: [{ paramName: 'param1', paramValue: 'value1' }] };
    
    component.navItems = [ navItem ];
    component.hostname = "http://example.com";
    component.isProduction = true;

    fixture.detectChanges();

    spyOn(window, 'open');
    component.onNavigate(navItem);

    expect(window.open).toHaveBeenCalledWith('http://example.com/path?param1=value1', '_blank');
  });
  
  it('deve retornar a string de consulta correta em normalizeParams', () => {
    const params: Params[] = [{ paramName: 'param1', paramValue: 'value1' }, { paramName: 'param2', paramValue: 'value2' }];
    const result = component.normalizeParams(params);
    expect(result).toBe('?param1=value1&param2=value2');
  });

});
