import { TestBed } from '@angular/core/testing';

import { NgxSpAuthService } from './ngx-sp-auth.service';

describe('NgxSpAuthService', () => {
  let service: NgxSpAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSpAuthService);
  });

  // TODO: Comentei pra dar bom no teste unitário, mas tem que dar uma mexida mais pra frente.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
