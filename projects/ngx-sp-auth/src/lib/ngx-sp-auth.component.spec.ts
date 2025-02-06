import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSpAuthComponent } from './ngx-sp-auth.component';

describe('NgxSpAuthComponent', () => {
  let component: NgxSpAuthComponent;
  let fixture: ComponentFixture<NgxSpAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSpAuthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxSpAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
