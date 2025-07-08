import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { A11yClickDirective } from './a11y-click.directive';

// #region Mock Component
@Component({
  template: `<div libA11yClick (a11yClick)="onAction()" tabindex="0">Test</div>`,
  standalone: true,
  imports: [ A11yClickDirective ]
})
class TestComponent {
  onAction = jasmine.createSpy('onAction');
}
// #endregion Mock Component


describe('Diretiva: [libA11yClick]', () => {
  let fixture: ComponentFixture<TestComponent>;
  let dirDebugEl: DebugElement;
  let directiveInstance: A11yClickDirective;
  let eventCount: number;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [ TestComponent ],
    }).createComponent(TestComponent);

    fixture.detectChanges();

    // 1) Pega o DebugElement que tem a diretiva
    dirDebugEl = fixture.debugElement.query(By.css('[libA11yClick]'))!;

    // 2) Extrai a instância da diretiva
    directiveInstance = dirDebugEl.injector.get(A11yClickDirective);

    // 3) Se inscreve no emitter
    eventCount = 0;
    directiveInstance.a11yClick.subscribe(() => eventCount++);
  });


  it('deve emitir evento ao clicar', () => {
    dirDebugEl.triggerEventHandler('click', new MouseEvent('click'));
    expect(fixture.componentInstance.onAction).toHaveBeenCalled();
  });

  it('deve emitir evento ao pressionar Enter', () => {
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    dirDebugEl.triggerEventHandler('keyup.enter', event);

    expect(fixture.componentInstance.onAction).toHaveBeenCalled();
  });

  it('não deve emitir para outras teclas', () => {
    const event = new KeyboardEvent('keyup', { key: 'Escape' });
    dirDebugEl.triggerEventHandler('keyup', event);

    expect(fixture.componentInstance.onAction).not.toHaveBeenCalled();
  });

  
  it('deve disparar a11yClick ao clicar', () => {
    dirDebugEl.triggerEventHandler('click', new MouseEvent('click'));
    expect(eventCount).toBe(1);
  });

  it('deve disparar a11yClick ao pressionar Enter', () => {
    dirDebugEl.triggerEventHandler('keyup.enter', new KeyboardEvent('keyup', { key: 'Enter' }));
    expect(eventCount).toBe(1);
  });

  it('não deve disparar a11yClick para outras teclas', () => {
    dirDebugEl.triggerEventHandler('keyup', new KeyboardEvent('keyup', { key: 'Escape' }));
    expect(eventCount).toBe(0);
  });
});
