import { TestBed } from '@angular/core/testing';

import { NgxSpAuthService } from './ngx-sp-auth.service';

describe('NgxSpAuthService', () => {
  let service: NgxSpAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSpAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
