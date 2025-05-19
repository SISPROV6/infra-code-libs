/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LoadingScreenComponent } from '../widgets/loading-screen/loading-screen.component';
import { GlobalLoadingService } from './global-loading.service';


// #region Mocks
class MockComponentFactoryResolver {
  resolveComponentFactory<T>() {
    return {
      create: () => {
        // 1. Cria um elemento "fake" que será anexado ao DOM no teste
        const fakeDomElement = document.createElement('div');

        // 2. Monta um hostView stub com rootNodes contendo esse elemento
        const fakeView = {
          rootNodes: [fakeDomElement]   // agora rootNodes[0] existe
        } as unknown as EmbeddedViewRef<any>;

        return {
          hostView: fakeView,
          instance: new LoadingScreenComponent(),
          destroy: jasmine.createSpy('destroy')
        } as unknown as ComponentRef<LoadingScreenComponent>;
      }
    } as unknown as ComponentFactory<T>;
  }
}

class MockApplicationRef {
  components = [{ instance: { viewContainerRef: {} } }];
  attachView = jasmine.createSpy('attachView');
  detachView = jasmine.createSpy('detachView');
}
// #endregion Mocks


describe('Serviço: GlobalLoadingService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        GlobalLoadingService,
        { provide: ComponentFactoryResolver, useClass: MockComponentFactoryResolver },
        { provide: ApplicationRef, useClass: MockApplicationRef }
      ]
    })
    .compileComponents();
  });


  it('deve criar e atribuir o componente de loading quando chamar show() e não existe instância prévia', () => {
    const service = TestBed.inject(GlobalLoadingService);
    const appRef = TestBed.inject(ApplicationRef) as any as MockApplicationRef;
    
    service.show();

    // Espera-se que attachView tenha sido chamado com algum hostView
    expect(appRef.attachView).toHaveBeenCalledTimes(1);

    // Verifica que componentRef não é nulo após show()
    expect((service as any)._componentRef).not.toBeNull();
  });

  it('não deve criar múltiplas instâncias se show() for chamado mais de uma vez', () => {
    const service = TestBed.inject(GlobalLoadingService);
    const appRef = TestBed.inject(ApplicationRef) as any as MockApplicationRef;

    service.show();
    service.show(); // segunda chamada deve ser ignorada

    expect(appRef.attachView).toHaveBeenCalledTimes(1);
  });

  it('deve remover o componente do DOM e chamar detachView em hide()', () => {
    const service = TestBed.inject(GlobalLoadingService);
    const appRef = TestBed.inject(ApplicationRef) as any as MockApplicationRef;

    service.show();
    service.hide();

    expect(appRef.detachView).toHaveBeenCalledTimes(1);
    expect((service as any)._componentRef).toBeNull();
  });

});