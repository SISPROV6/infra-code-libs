import { NgIf } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorMessageComponent, LibIconsComponent, RequiredDirective, TextFilterPipe } from 'ngx-sp-infra';
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