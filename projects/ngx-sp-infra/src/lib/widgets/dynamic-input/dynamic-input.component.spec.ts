/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicInputComponent } from './dynamic-input.component';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxCurrencyDirective } from 'ngx-currency';


describe('Componente: lib-dynamic-input', () => {
  let component: DynamicInputComponent;
  let fixture: ComponentFixture<DynamicInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicInputComponent ],
      imports: [
        FormsModule,
        NgxMaskDirective,
        NgxCurrencyDirective
      ],
      providers: [ provideNgxMask() ]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicInputComponent);
    component = fixture.componentInstance;
  });


  // #region Validação da propriedade disableInput
  const inputTypes: any[] = [ 'date', 'integer', 'decimal', 'phone', 'text', 'longtext', 'time', 'datetime' ];
  
  inputTypes.forEach((type) => {
    it(`tipo ${type}: deve desabilitar o input quando @Input() disableInput for true`, () => {
      component.disableInput = true;
      component.typeInput = type;
      fixture.detectChanges();
  
      const inputElement = fixture.debugElement.query(By.css(`#dynamicInput_${type}`)).nativeElement;
      expect(inputElement.getAttribute('ng-reflect-is-disabled')).toBe('true');
    });

    it(`tipo ${type}: deve habilitar o input quando @Input() disableInput for false`, () => {
      component.disableInput = false;
      component.typeInput = type;
      fixture.detectChanges();
  
      const inputElement = fixture.debugElement.query(By.css(`#dynamicInput_${type}`)).nativeElement;
      expect(inputElement.getAttribute('ng-reflect-is-disabled')).toBe('false');
    });
  
    it(`tipo ${type}: deve habilitar o input quando @Input() disableInput não for definido`, () => {
      component.typeInput = type;
      fixture.detectChanges();
  
      const inputElement = fixture.debugElement.query(By.css(`#dynamicInput_${type}`)).nativeElement;
      expect(inputElement.getAttribute('ng-reflect-is-disabled')).toBe('false');
    });
  });
  // #endregion Validação da propriedade disableInput

});