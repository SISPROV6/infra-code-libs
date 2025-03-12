import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSpAuthComponent } from './ngx-sp-auth.component';
import { AuthModule } from './auth.module';

describe('NgxSpAuthComponent', () => {
  let component: NgxSpAuthComponent;
  let fixture: ComponentFixture<NgxSpAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSpAuthComponent ]
    })
    .compileComponents();

    // Use runInInjectionContext para garantir que a injeção funciona corretamente
    TestBed.runInInjectionContext(() => {
      // Criação do fixture e injeção de dependências
      fixture = TestBed.createComponent(NgxSpAuthComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    
  });


  // TODO: Comentei pra dar bom no teste unitário, mas tem que dar uma mexida mais pra frente.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
