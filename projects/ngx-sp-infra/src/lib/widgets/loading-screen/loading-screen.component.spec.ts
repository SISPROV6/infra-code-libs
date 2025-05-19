import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingScreenComponent } from './loading-screen.component';

describe('lib-loading-screen', () => {
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


});
