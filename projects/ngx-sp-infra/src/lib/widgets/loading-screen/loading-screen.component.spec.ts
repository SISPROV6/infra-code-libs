import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingScreenComponent } from './loading-screen.component';

describe('Componente: lib-loading-screen', () => {
  let component: LoadingScreenComponent;
  let fixture: ComponentFixture<LoadingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoadingScreenComponent
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('deve renderizar corretamente o componente quando chamado', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o spinner e o backdrop', () => {
    fixture.detectChanges();

    const overlayElem: HTMLElement = fixture.nativeElement.querySelector('.loader-background');
    
    expect(overlayElem).toBeTruthy();
  });

});
