import { TestBed } from '@angular/core/testing';

import { ApicarritoService } from './apicarrito.service';

describe('ApicarritoService', () => {
  let service: ApicarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApicarritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
