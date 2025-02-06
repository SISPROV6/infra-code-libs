import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MessageService } from '../../message/message.service';
import { BsModalService } from 'ngx-bootstrap/modal';

import { TenantService } from '../../service/tenant.service';
import { LibConfigSenhaComponent } from './lib-config-senha.component';
import { ConfiguracaoSenhaService } from '../../service/configuracao-senha.service';
import { InfraModule } from '../../infra.module';

describe('Componente: Formulário de configuração de senhas', () => {
  let component: LibConfigSenhaComponent;
  let fixture: ComponentFixture<LibConfigSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibConfigSenhaComponent ],
      imports: [ HttpClientModule, InfraModule ],
      providers: [ ConfiguracaoSenhaService, BsModalService, MessageService, TenantService ]
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
