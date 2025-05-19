import { NgIf } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredDirective } from '../../directives/required.directive';
import { TextFilterPipe } from '../../pipes/text-filter.pipe';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';
import { LibComboboxComponent } from './lib-combobox.component';

describe('lib-combobox', () => {
   let component: LibComboboxComponent;
   let fixture: ComponentFixture<LibComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LibComboboxComponent,
        NgIf,
        RequiredDirective,
        FormsModule,
        ReactiveFormsModule,
        LibIconsComponent,
        FieldErrorMessageComponent,
        TextFilterPipe,
      ],
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(LibComboboxComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });
  });


  it('deve renderizar o componente corretamente quando chamado', () => {
    const fixture = TestBed.createComponent(LibComboboxComponent);
    const header = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(header).toBeTruthy();
  });

  it('deve emitir o valor atualizado ao alterar o ngModel', () => {
    spyOn(component.changePesquisa, 'emit');

    const input: HTMLInputElement = fixture.nativeElement.querySelector('.searchInput');
    input.value = 'Novo valor';
    input.dispatchEvent(new Event('input')); // dispara o input
    fixture.detectChanges(); // atualiza binding

    expect(component.changePesquisa.emit).toHaveBeenCalledWith('Novo valor');
  });
});