import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibConfigSenhaComponent } from './lib-config-senha.component';

describe('Componente: Formulário de configuração de senhas', () => {
  let component: LibConfigSenhaComponent;
  let fixture: ComponentFixture<LibConfigSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibConfigSenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibConfigSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
