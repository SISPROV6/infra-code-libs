import { Component } from '@angular/core';
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

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [ TestComponent ],
    }).createComponent(TestComponent);

    fixture.detectChanges();
  });


  it('deve emitir evento ao clicar', () => {
    const el = fixture.debugElement.query(By.css('[libA11yClick]'));

    el.triggerEventHandler('click', new MouseEvent('click'));
    expect(fixture.componentInstance.onAction).toHaveBeenCalled();
  });

  it('deve emitir evento ao pressionar Enter', () => {
    const el = fixture.debugElement.query(By.css('[libA11yClick]'));
    const event = new KeyboardEvent('keyup', { key: 'Enter' });

    el.triggerEventHandler('keyup.enter', event);

    expect(fixture.componentInstance.onAction).toHaveBeenCalled();
  });

  it('não deve emitir para outras teclas', () => {
    const el = fixture.debugElement.query(By.css('[libA11yClick]'));
    const event = new KeyboardEvent('keyup', { key: 'Escape' });

    el.triggerEventHandler('keyup', event);

    expect(fixture.componentInstance.onAction).not.toHaveBeenCalled();
  });
});
