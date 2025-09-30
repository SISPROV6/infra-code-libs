import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsModalService } from 'ngx-bootstrap/modal';
import { InfraModule, MessageService } from 'ngx-sp-infra';

import { ConfiguracaoSenhaService } from '../../services/configuracao-senha.service';
import { TenantService } from '../../services/tenant.service';
import { LibConfigSenhaComponent } from './lib-config-senha.component';

describe('Componente: Formulário de configuração de senhas', () => {
  let component: LibConfigSenhaComponent;
  let fixture: ComponentFixture<LibConfigSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HttpClientModule, InfraModule, LibConfigSenhaComponent],
    providers: [ConfiguracaoSenhaService, BsModalService, MessageService, TenantService]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(LibConfigSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve renderizar o componente corretamente', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Vou ficar de escrever os testes mais robustos uma outra hora honestamente...
  
});
